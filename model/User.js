const User = require('./schemas/user').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../lib/email');

class UserModel {
    logIn(req, res, email, password) {
        User.findOne({ email: email }, (err, user) => {
            if (err) return res.status(500).json({err: true, msg: err.message });
            if (user) {
                if (email == user.email) {
                    bcrypt.compare(password, user.password, (err, flag) => {
                        if (flag) {
                            const token = jwt.sign({ id: user._id }, 'secret');
                            return res.json({err: false, token: token, user: user })
                        }
                        res.status(401).json({err: true, msg: "Incorrect login or password" })
                    })
                }
            } else {
                res.status(401).json({err: true, msg: "Incorrect login or password" })
            }
        })
    }

    signUp(req, res, email, password, name) {
        User.findOne({ email: email })
            .exec(async (err, findEmail) => {
                if (err) return res.status(500).json({err: true, msg: err.message });
                if (findEmail) {
                    res.status(401).json({err: true, msg: 'user alredy exists' })
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) console.log('err hash', err)
                            const user = new User({
                                name: name,
                                email: email,
                                password: hash,
                                code: null
                            })
                            user.save((err, userData) => {
                                if (err) res.status(500).json({err: true, msg: err.message });
                                const token = jwt.sign({ id: user._id }, 'secret');
                                console.log('token', token)
                                res.json({err: false, user: userData, token })
                            })
                        })
                    })

                }
            })
    }


    forgotPassword(req, res, email) {
        console.log('email', email)
        User.findOne({ email: email })
            .exec(async (err, findEmail) => {
                if (err) return res.status(500).json({err: true, msg: err.message });
                if (!findEmail) {
                    res.status(401).json({err: true, msg: 'email address does not exists' })
                } else {
                    const token = jwt.sign({ id: findEmail._id }, 'secret');
                    const RadnomDigigts = Math.floor(1000 + Math.random() * 9000);
                    User.findByIdAndUpdate(findEmail._id, { code: RadnomDigigts }, { new: true }, (err, user) => {
                        if (err) return res.status(500).json({err: true, msg: err.message });
                    });
                    sendMail(res, token, findEmail.email, RadnomDigigts)
                }
            })
    }

    confirmCode(res, id, code) {
        User.findById(id, (err, user) => {
            if (err) return res.status(500).json({err: true, msg: err.message });
            if(code == user.code) {
                const token = jwt.sign({ id: user._id }, 'secret');
                return res.json({err: false, token: token })
            }
            res.status(401).json({ err: true, msg: 'code is not valid' })
        })
    }

    resetPassword (res, id, password) {
        User.findById(id, (err, user) => {
            if (err) return res.status(500).json({err: true, msg: err.message });
            const token = jwt.sign({ id: user._id }, 'secret');
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    user.password = hash
                    return res.json({ err: false, token: token, user: user })
                })
            })
        })
    }

}

module.exports = new UserModel()