const mongoose = require('mongoose');
const Room = require('../models/room');
const User = require('../models/user');
const userProfile = require('../models/userProfile');


mongoose.connect('mongodb://127.0.0.1:27017/seekers', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

    const seedDB = async () => {
        await Room.deleteMany({});
        await User.deleteMany({});
        await userProfile.deleteMany({});
}  
    seedDB().then(() => {
        mongoose.connection.close();
    })