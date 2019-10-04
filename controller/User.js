const UserModel = require('../model/User')
const jwt = require('jsonwebtoken');


class User {
    logIn(req, res) {
        const { email, password } = req.body;
        UserModel.logIn(req, res, email, password)
    }

    signUp(req, res) {
        const { email, password, name } = req.body;
        UserModel.signUp(req, res, email, password, name)
    }

    forgotPassword(req, res) {
        const { email } = req.body;
        UserModel.forgotPassword(req, res, email)
    }

    confirmCode(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const { code } = req.body;
        jwt.verify(token, 'secret', function (err, decoded) {
            if(err) return res.status(403).json({ msg: 'token not valid' })
            UserModel.confirmCode(res, decoded.id, code)
        });
    }
    
    resetPassword (req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const { password } = req.body;
        jwt.verify(token, 'secret', function (err, decoded) {
            if(err) return res.status(403).json({ msg: 'token not valid' })
            UserModel.resetPassword(res, decoded.id, password)
        });
    }
}

module.exports = new User();
