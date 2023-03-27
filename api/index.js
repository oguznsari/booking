const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const User = require('./models/User')
const Place = require('./models/Place')
const Booking = require('./models/Booking')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const { request } = require("express");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());                                        // json parser
app.use(cookieParser());                                        // cookie parser

app.use('/uploads', express.static(__dirname + '/uploads'))

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

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg'
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName)
})

const photosMiddleware = multer({ dest: 'uploads/' })
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (const [key, value] of Object.entries(req.files)) {
        const { path, originalname } = value;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''));
    }
    res.json(uploadedFiles)
})

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, addedPhotos, description, perks,
        extraInfo, checkIn, checkOut, maxGuests, price
    } = req.body;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err;

        const placeDoc = await Place.create({
            owner: userData.id,
            title, address, photos: addedPhotos, description, perks,
            extraInfo, checkIn, checkOut, maxGuests, price
        });

        res.json(placeDoc);
    });
});

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }))
    })
})

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id))
})

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        id, title, address, addedPhotos, description, perks,
        extraInfo, checkIn, checkOut, maxGuests, price
    } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err;

        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description, perks,
                extraInfo, checkIn, checkOut, maxGuests, price
            })
            await placeDoc.save();
            res.json('ok');
        }
    });
})

app.get('/places', async (req, res) => {
    res.json(await Place.find())
});

app.post('/bookings', (req, res) => {
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    })
})

app.listen(4000)

try {

} catch (error) {

}