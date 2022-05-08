const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };
const RoomSchema = new Schema({
    rent: Number,
    deposit: Number,
    description: String,
    address: String,
    neighbourhood: String,
    ageMin: Number,
    ageMax: Number,
    slogan: String,
    minStay: String,
    mateMale: String,
    mateFemale: String,
    city: String,
    bed: String,
    ensuite: String,
    bills: String,
    livingAs: String,
    status: String,
    gender: String,
    dateStart: String,
    dateEnd: String,
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    authorProfile: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    }

}, opts);

module.exports = mongoose.model('Room', RoomSchema);