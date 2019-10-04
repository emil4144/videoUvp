const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    code: String
},{ versionKey: false })


module.exports.User = mongoose.model('User', userSchema);