const Place = require("../models/Place");
const jwt = require('jsonwebtoken');

const getAllPlaces = async (req, res) => {
    res.json(await Place.find());
}

const getPlaceWithId = async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id))
}

const savePlace = (req, res) => {
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
}

const updatePlace = async (req, res) => {
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
}

const getUserPlaces = (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }))
    })
}

module.exports = {
    getAllPlaces,
    getPlaceWithId,
    savePlace,
    updatePlace,
    getUserPlaces
}