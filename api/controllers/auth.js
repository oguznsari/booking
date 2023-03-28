const User = require('../models/User')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, salt)
        });
        res.json(user);
    } catch (error) {
        res.status(422).json(error)
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user && user.password) {
            const passOk = bcrypt.compareSync(password, user.password)
            if (passOk) {
                const token = user.createJWT();
                res.cookie('token', token).json(user)
            } else {
                res.status(422).json('pass not ok!')
            }
        } else {
            res.json('not found!');
        }
    } catch (error) {
        console.log({ error })
    }
}

const getUserProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        })
    } else {
        res.json(null)
    }
}

const logoutUser = (req, res) => {
    res.cookie('token', '').json(true)
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
}