const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require("path");

const { getAllPlaces, getPlaceWithId, savePlace, updatePlace, getUserPlaces } = require('../controllers/places')
const { getAllBookings, createBooking } = require('../controllers/bookings')
const { registerUser, loginUser, logoutUser, getUserProfile } = require('../controllers/auth')
const { uploadWithLink, uploadImageFile } = require('../controllers/image');

router.post('/places', savePlace).put('/places', updatePlace).get('/places', getAllPlaces).get('/places/:id', getPlaceWithId).get('/user-places', getUserPlaces)
router.post('/bookings', createBooking).get('/bookings', getAllBookings)
router.post('/register', registerUser).post('/login', loginUser).post('/logout', logoutUser).get('/profile', getUserProfile)

const photosMiddleware = multer({ dest: 'uploads' })
router.post('/upload', photosMiddleware.array('photos', 100), uploadImageFile).post('/upload-by-link', uploadWithLink)

module.exports = router;