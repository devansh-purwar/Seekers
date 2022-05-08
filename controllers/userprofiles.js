const UserProfile = require('../models/userProfile');
const Room = require('../models/room');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

module.exports.index = async (req, res, next) => {
    console.log("hello userprofile index")
    const userProfiles = await UserProfile.find({ 'profilePrivacy' : { $ne : 'Hidden'}});
    res.render('users/index', { profiles:userProfiles });
}

module.exports.search = async (req, res,next) => {
    console.log("hello userprofile search")
    const searchF = req.body;
    console.log(searchF);
    var userProfiles;
    if(searchF.search){
        console.log('Hello')
        if(!searchF.search.city){
            console.log(' No City inputed')
            userProfiles = await UserProfile.find({ 'profilePrivacy' : { $ne : 'Hidden'}});
            if(!searchF.search.gender){
                console.log('No Gender inputed')
                userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}}]});
                if(!searchF.search.looking){
                    console.log('No Looking inputed')
                    userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}}]});
                } else {
                    if(searchF.search.looking==='Room'){
                        console.log('room inputed')
                        userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}},{'lookingForRooms':'Yes'}]});
                    } else if (searchF.search.looking==='Team Up'){
                        console.log('Team Up inputed')
                        userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}},{'lookingTeamUP':'Yes'}]});
                    }
                }
            } else {
                if(!searchF.search.looking){
                    console.log('No Looking inputed')
                    userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}},{'gender':searchF.search.gender}]});
                } else {
                    if(searchF.search.looking==='Room'){
                        console.log('room inputed')
                        userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}},{'gender':searchF.search.gender},
                                                    {'lookingForRooms':'Yes'}]});
                    } else if (searchF.search.looking==='Team Up'){
                        console.log('Team Up inputed')
                        userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}},{'gender':searchF.search.gender},
                                                    {'lookingTeamUP':'Yes'}]});
                    }
                }
            }

        } else {
            if(!searchF.search.gender){
                console.log('No Gender inputed')
                userProfiles = await UserProfile.find({$and:[{"city":searchF.search.city},
                                                        {'profilePrivacy' : { $ne : 'Hidden'}}]});
                                                        if(!searchF.search.looking){
                                                            console.log('No Looking inputed')
                                                            userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}},{"city":searchF.search.city}]});
                                                        } else {
                                                            if(searchF.search.looking==='Room'){
                                                                console.log('room inputed')
                                                                userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}},{'lookingForRooms':'Yes'},{"city":searchF.search.city}]});
                                                            } else if (searchF.search.looking==='Team Up'){
                                                                console.log('Team Up inputed')
                                                                userProfiles = await UserProfile.find({$and:[{'profilePrivacy' : { $ne : 'Hidden'}},{'lookingTeamUP':'Yes'},{"city":searchF.search.city}]});
                                                            }
                                                        }
            } else {
                if(!searchF.search.looking){
                    console.log('No Looking inputed')
                    userProfiles = await UserProfile.find({$and:[{"city":searchF.search.city},
                                                            {'profilePrivacy' : { $ne : 'Hidden'}},{'gender':searchF.search.gender}]});
                } else {
                    if(searchF.search.looking==='Room'){
                        console.log('room inputed')
                        userProfiles = await UserProfile.find({$and:[{"city":searchF.search.city},
                                                    {'profilePrivacy' : { $ne : 'Hidden'}},{'gender':searchF.search.gender},
                                                    {'lookingForRooms':'Yes'}]});
                    } else if (searchF.search.looking==='Team Up'){
                        console.log('Team Up inputed')
                        userProfiles = await UserProfile.find({$and:[{"city":searchF.search.city},
                                                    {'profilePrivacy' : { $ne : 'Hidden'}},{'gender':searchF.search.gender},
                                                    {'lookingTeamUP':'Yes'}]});
                    }
                }
            }
        }
            // const userProfiles = await UserProfile.find({$and:[{"city":searchF.search.city},
    //                                                 {'profilePrivacy' : { $ne : 'Hidden'}},{'gender':searchF.search.gender},
    //                                                 {'lookingForRooms':r},{'lookingTeamUP':t}]});
    } else {
        console.log("No field inputed")
        userProfiles = await UserProfile.find({ 'profilePrivacy' : { $ne : 'Hidden'}});
    }
    res.render('users/index', { profiles:userProfiles });
}

module.exports.renderCreateUserProfile = (req, res) => {
    console.log("hello userprofile renderCreateUserProfile")
    res.render('users/userProfile');
}


module.exports.createUserProfile = async (req, res, next) => {
    console.log("hello userprofile createUserProfile")
    console.log(req.body)
    console.log(req.body.roommate)
    console.log(req.files,"cj")
    const userProfile = new UserProfile(req.body.roommate);
    console.log("userProfile", userProfile);
    userProfile.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    userProfile.author = req.user._id;
    await userProfile.save();
    console.log(userProfile);
    req.flash('success', 'Successfully made a New Profile!');
    res.redirect(`/userProfiles/${userProfile._id}`)
}


module.exports.showUserProfile = async (req, res,) => {
    console.log("hello userprofile showUserProfile")
    console.log(req.params.id);
    const userProfile = await UserProfile.findById(req.params.id)
    const user = await User.findById(userProfile.author)
    console.log(user)
    console.log(userProfile);
    if (!userProfile) {
        req.flash('error', 'Cannot find that Profile!');
        return res.redirect('/userProfiles');
    }
    res.render('users/show', { userProfile , user });
}


module.exports.renderUserProfileEditForm = async (req, res) => {
    console.log("hello userprofile renderUserProfileEditForm")
    const { id } = req.params;
    const userProfile = await UserProfile.findById(id)
    const user = await User.findById(userProfile.author)
    if (!userProfile) {
        req.flash('error', 'Cannot find that Profile!');
        return res.redirect('/users');
    }
    res.render('users/edit', { userProfile, user});
}


module.exports.updateUserProfile = async (req, res) => {
    console.log("hello userprofile updateUserProfile")
    const { id } = req.params;
    console.log(req.body);
    const userProfile = await UserProfile.findByIdAndUpdate(id, { ...req.body.roommate });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    console.log("--------------------- imgs ---------------------",userProfile.images)
    console.log('||||||||||',imgs,'||||||||||||||||||||')
    if(imgs.length){
        userProfile.images = [];
    }
    console.log("--------------------- imgs ---------------------",userProfile.images)
    userProfile.images.push(...imgs);
    await userProfile.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await userProfile.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated Profile!');
    res.redirect(`/userProfiles/${userProfile._id}`)
}


module.exports.userListings = async (req, res) => {
    console.log("hello userprofile userListings")
    const rooms = await Room.find({ "author": req.user._id });
    console.log(rooms);
    if (!rooms.length) {
    }
    res.render('users/listing', { rooms });
}


