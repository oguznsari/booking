const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const User = require('./models/User')

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());                                        // json parser

app.get('/test', (req, res) => {
    res.json('test ok.')
})

mongoose.connect(process.env.MONGO_URI);

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log({ name, email, password })
    User.create({
        name,
        email,
        password
    })
    res.json({ name, email, password });
})

app.listen(4000)

try {

} catch (error) {

}