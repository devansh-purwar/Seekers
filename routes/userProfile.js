const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateRoommate, isLoggedIn, isUserProfileAuthor,isUserProfileExist,isUserVerified } = require('../middleware');
const userProfiles = require('../controllers/userprofiles');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Room = require('../models/room');
const UserProfile = require('../models/userProfile');
const ExpressError = require('../utils/ExpressError');


router.route('/')
    .get(catchAsync(userProfiles.index))
    .post(isLoggedIn, isUserVerified , isUserProfileExist ,upload.array('image'), validateRoommate, catchAsync(userProfiles.createUserProfile));

router.get('/new', isLoggedIn, isUserVerified, isUserProfileExist ,userProfiles.renderCreateUserProfile)

router.route('/:id')
    .get(isUserProfileExist,catchAsync(userProfiles.showUserProfile))
    .put(isLoggedIn, isUserVerified ,isUserProfileAuthor, upload.array('image'), validateRoommate, catchAsync(userProfiles.updateUserProfile))

router.get('/:id/edit', isLoggedIn,isUserVerified, isUserProfileAuthor, catchAsync(userProfiles.renderUserProfileEditForm))
router.get('/:id/listings', isLoggedIn, isUserVerified, isUserProfileAuthor,catchAsync(userProfiles.userListings))

router.post('/search',catchAsync(userProfiles.search))
module.exports = router;