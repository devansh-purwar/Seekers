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
const UserProfileSchema = new Schema({
    name: String,
    city: String,
    dob: String,
    gender: String,
    status: String,
    livingAs: String,
    budget: String,
    idealMoveDate: String,
    lookingForRooms: String,
    lookingTeamUP: String,
    profilePrivacy: String,
    bio: String,
    lifestyle: [String],
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, opts);

module.exports = mongoose.model('UserProfile', UserProfileSchema);
