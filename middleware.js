const { roomSchema, userProfileSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Room = require('./models/room');
const UserProfile = require('./models/userProfile');
const User = require('./models/user');
var ObjectId = require('mongodb').ObjectId;


module.exports.isUserVerified = async (req, res, next) => {
    console.log("hello isUserVerified")
    // console.log(req);
    console.log('-----------------------------------------')
    // console.log(req.user)
    const user = await User.findById(req.user._id);
    if (!user.isVerified) {
        console.log("user not verified")
        req.flash('error', 'You must be verified first!');
        return res.redirect(`/`);
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    console.log("hello isLoggedIn")
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateRoom = (req, res, next) => {
    console.log("hello validateRoom")
    const { error } = roomSchema.validate(req.body);
    console.log(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    console.log("hello isAuthor")
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/rooms/${id}`);
    }
    next();
}

module.exports.validateRoommate = (req, res, next) => {
    console.log("hello validateRoommate")
    console.log(req.body);
    const { error } = userProfileSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isUserProfileAuthor = async (req, res, next) => {
    console.log("hello isUserProfileAuthor")
    const { id } = req.params;
    const profile = await UserProfile.findById(id);
    console.log(profile)
    if (!profile.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        console.log('no permission')
        return res.redirect(`/userProfiles/${id}`);
    }
    next();
}

module.exports.isUserProfileExist = async (req, res, next) => {
    console.log("hello isUserProfileExist")
    const { id } = req.params;
    if (id) {
        if (!req.user) {
            console.log("not logged in")
            next();
        } else {
            console.log(id)
            const profile = await UserProfile.findById(id);
            console.log(profile)
            // if (!profile.author.equals(req.user._id)) {
            //     req.flash('error', 'You do not have permission to do that!');
            //     console.log('no permission')
            //     return res.redirect(`/userProfiles/${id}`);
            // }
            next();
        }
    } else {
        const profile = await UserProfile.find({ "author": req.user._id });
        console.log(profile)
        console.log(req.user._id)
        if (profile.length && profile[0].author.equals(req.user._id)) {
            return res.redirect(`/userProfiles/${profile[0]._id.toString()}/edit`);
        }
        next();
    }
}