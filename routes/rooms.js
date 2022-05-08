const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateRoom,isUserVerified , isUserProfileExist } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Room = require('../models/room');

router.route('/')
    .get(catchAsync(rooms.index))
    .post(isLoggedIn, isUserVerified, upload.array('image'), validateRoom, catchAsync(rooms.createRoom));

router.get('/new', isLoggedIn,isUserVerified, rooms.renderNewForm)

router.route('/:id')
    .get(catchAsync(rooms.showRoom))
    .put(isLoggedIn,isUserVerified, isAuthor, upload.array('image'), validateRoom, catchAsync(rooms.updateRoom))
    .delete(isLoggedIn, isUserVerified ,isAuthor, catchAsync(rooms.deleteRoom));

router.get('/:id/edit', isLoggedIn,isUserVerified, isAuthor, catchAsync(rooms.renderEditForm))

router.post('/search', catchAsync(rooms.search))


module.exports = router;