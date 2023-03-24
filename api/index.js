const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const User = require('./models/User')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const { request } = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());                                        // json parser
app.use(cookieParser());                                        // cookie parser

app.get('/test', (req, res) => {
    res.json('test ok.')
})

mongoose.connect(process.env.MONGO_URI);

app.post('/register', async (req, res) => {
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
})

app.post('/login', async (req, res) => {
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
})

app.get('/profile', (req, res) => {
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
})

app.listen(4000)

try {

} catch (error) {

}