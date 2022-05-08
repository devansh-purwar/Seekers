const Room = require('../models/room');
const User = require('../models/user');
const UserProfile = require('../models/userProfile');
var ObjectId = require('mongodb').ObjectId;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    console.log("hello rooms index")
    const rooms = await Room.find({}).populate('authorProfile')
    res.render('rooms/index', { rooms })
}
module.exports.renderNewForm = async (req, res) => {
    console.log("hello rooms render new form")
    const userProfile = await UserProfile.findOne({author:req.user._id});

    if(!userProfile){
        req.flash('error', 'You must have a profile to make a new listing!');
        return res.redirect('/userProfiles/new');
    }
    res.render('rooms/new');
}
module.exports.createRoom = async (req, res, next) => {
    console.log("hello rooms create room")
    const geoData = await geocoder.forwardGeocode({
        query: req.body.room.address,
        limit: 1
    }).send()
    console.log("geoData", geoData);
    const room = new Room(req.body.room);
    console.log("room", room);
    room.geometry = geoData.body.features[0].geometry;
    room.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    room.author = req.user._id;
    const userProfile = await UserProfile.findOne({author:req.user._id});
    room.authorProfile = userProfile._id;
    await room.save();
    console.log(room);
    req.flash('success', 'Successfully made a new room!');
    res.redirect(`/rooms/${room._id}`)
}
module.exports.showRoom = async (req, res,) => {
    console.log("hello rooms show room")
    const room = await Room.findById(req.params.id)
    if(!room){
        req.flash('error', 'Cannot find that room!');
        return res.redirect('/rooms');
    }
    const user = await User.findById(room.author)
    console.log(user)
    const userProfile = await UserProfile.findOne({author:user._id});
    console.log(userProfile)
    if (!room) {
        req.flash('error', 'Cannot find that room!');
        return res.redirect('/rooms');
    }
    res.render('rooms/show', { room, userProfile , user });
}
module.exports.renderEditForm = async (req, res) => {
    console.log("hello rooms render edit form")
    const { id } = req.params;
    const room = await Room.findById(id)
    if (!room) {
        req.flash('error', 'Cannot find that room!');
        return res.redirect('/rooms');
    }
    res.render('rooms/edit', { room });
}
module.exports.updateRoom = async (req, res) => {
    console.log("hello rooms update room")
    const { id } = req.params;
    console.log(req.body);
    const room = await Room.findByIdAndUpdate(id, { ...req.body.room });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    room.images.push(...imgs);
    await room.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await room.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated room!');
    res.redirect(`/rooms/${room._id}`)
}
module.exports.deleteRoom = async (req, res) => {
    console.log("hello rooms delete room")
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted listing')
    res.redirect('/myListings');
}

module.exports.search = async (req, res) => {
    console.log("hello rooms search")
    const searchF =req.body;
    console.log(searchF);
    if(!searchF.search.budget){
        searchF.search.budget = 10000000;
    }
    var rooms = await Room.find({$and:[{"city":searchF.search.city},{"rent":{ $lte: parseInt(searchF.search.budget)  }}]}).populate('authorProfile');

    if(!searchF.search.city){
            rooms = await Room.find({$and:[{"rent":{ $lte: parseInt(searchF.search.budget)  }}]}).populate('authorProfile');
    }
    console.log(rooms);
    res.render('rooms/index', { rooms })
}