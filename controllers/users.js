const User = require('../models/user');
const UserProfile = require('../models/userProfile');
const Room = require('../models/room');
const passwordValidator = require('password-validator');
const randomstring = require("randomstring");
const { sendEmailVerificationLink } = require('./mail');
var ObjectId = require('mongodb').ObjectId;

const schema = new passwordValidator();

schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces()


module.exports.renderRegister = (req, res) => {
    console.log("hello user renderRegister")
    console.log(req.user);
    if (req.user) {
        req.flash('error', 'Logout First!');
        res.redirect('/');
    }
    res.render('users/register');
}
module.exports.register = async (req, res, next) => {
    console.log(req.body);
    try {
        const { email, username, password, cPassword } = req.body;
        if (password !== cPassword) {
            req.flash('error', 'Password and Confirm Password not match');
            return res.redirect('/register');
        }
        if (!schema.validate(password)) {
            req.flash('error', 'Password must be at least 8 characters, contain uppercase, lowercase, and numbers');
            return res.redirect('register');
        }
        const verifyToken = randomstring.generate();
        const user = new User({ email, username, verifyToken });
        const registeredUser = await User.register(user, password);
        console.log('||||||||||||||||',registeredUser,"||||||||||");
        // sendEmailVerificationLink(user, verifyToken, req, res => {
        //     if (res == 200) {
        //         res.send({ code: '010', msg: "Signup Successfull & Verification Email Successfully Sent!" });
        //     } else {
        //         res.send({ code: '011', msg: "Signup Successfull but failed to send verification email" });
        //     }
        // });
        console.log(registeredUser, "registeredUser");
        req.login(registeredUser, err => {
            console.log(err, "err");
            if (err) return next(err);
            req.flash('success', 'Welcome to Seekers!');
            // req.flash('success', 'Welcome to Seekers! , Verify your email to get started!');
            res.redirect('/');
        });

    } catch (e) {
        console.log(e, "e");
        console.log(e.code, "e.code");
        if(e.code == 11000){
            req.flash('error', 'Email already in Use!');
            return res.redirect('/register');
        }
        req.flash('error', e.message);
        res.redirect('register');
    }
}
module.exports.renderLogin = (req, res) => {
    console.log("hello user renderLogin")
    console.log(req.user);
    if (req.user) {
        req.flash('error', 'Logout First!');
        res.redirect('/');
    }
    res.render('users/login');
}
module.exports.login = (req, res) => {
    console.log(req.body);
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    console.log("hello user logout")
    console.log(req.user);
    if (!req.user) {
        req.flash('error', 'Login First!');
        res.redirect('/login');
    }
    req.logout();
    console.log("logout")
    req.flash('success', "Goodbye!");
    res.redirect('/');
}

module.exports.renderEditForm = async (req, res) => {
    console.log("hello user renderEditForm")
    if(!req.user){
        req.flash('error', 'Login First!');
        return res.redirect('/');
    }
    const user = await User.findById(req.user._id);
    console.log(user);
    const userProfile = await UserProfile.find({ "author": new ObjectId(req.user._id) })
    console.log(userProfile);
    if (!userProfile.length) {
        req.flash('success', 'Create Profile !');
        return res.redirect('/userProfiles/new');
    }
    res.render('users/edit', { userProfile: userProfile[0], user });
}

module.exports.renderMyListings = async (req, res) => {
    console.log("hello user renderMyListings")
    if(!req.user){
        req.flash('error', 'Login First!');
        return res.redirect('/');
    }
    const userProfile = await UserProfile.find({ "author": new ObjectId(req.user._id) });
    if(!userProfile.length){
        req.flash('error', "You don't have access to this page! , Create your profile first!");
        return res.redirect('/userProfiles/new');
    }
    const rooms = await Room.find({ "author": new ObjectId(req.user._id) });
    if(!rooms.length){
    }
    res.redirect('/userProfiles/' + userProfile[0]._id +"/listings");
}