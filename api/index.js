const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const User = require('./models/User')
const bcypt = require('bcryptjs')
const salt = bcypt.genSaltSync(10);

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

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password: bcypt.hashSync(password, salt)
        });
        res.json(user);
    } catch (error) {
        res.status(422).json(error)
    }
})

app.listen(4000)

try {

} catch (error) {

}