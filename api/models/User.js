const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { email: this.email, id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    )
}

module.exports = mongoose.model('User', UserSchema);