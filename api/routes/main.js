const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require("path");

const { getAllPlaces, getPlaceWithId, savePlace, updatePlace, getUserPlaces } = require('../controllers/places')
const { getAllBookings, createBooking } = require('../controllers/bookings')
const { registerUser, loginUser, logoutUser, getUserProfile } = require('../controllers/auth')
const { uploadWithLink, uploadImageFile } = require('../controllers/image');

router.route('/places').post(savePlace).put(updatePlace).get(getAllPlaces)
router.route('/places/:id').get(getPlaceWithId)
router.route('/user-places').get(getUserPlaces)
router.route('/bookings').post(createBooking).get(getAllBookings)
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('profile').get(getUserProfile)

const photosMiddleware = multer({ dest: 'uploads' })
router.post('/upload', photosMiddleware.array('photos', 100), uploadImageFile).post('/upload-by-link', uploadWithLink)

module.exports = router;