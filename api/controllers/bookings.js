const Booking = require("../models/Booking");
const jwt = require('jsonwebtoken');


function getUserDataFromToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    })
}

const createBooking = async (req, res) => {
    const userData = await getUserDataFromToken(req.cookies.token)
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
        user: userData.id
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    })
}

const getAllBookings = async (req, res) => {
    const { token } = req.cookies;
    const userData = await getUserDataFromToken(token);
    res.json(await Booking.find({ user: userData.id }).populate('place'))           // important usage populate
}

module.exports = {
    getAllBookings,
    createBooking
}