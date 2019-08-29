const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    googleId: String,

    username: String,
    preferredName: String,
    visitFrequency: String,
    timeSlots: [String],
    feelAboutYoutubeRec: String,
    recWatchFrequency: String,
    purposes: [String],
    occupation: String,
    politicalAttitude: String,

    intentions: [String],
    memories: [String],

    takeout1Id: mongoose.Schema.Types.ObjectId,
    takeout2Id: mongoose.Schema.Types.ObjectId,
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema); // creat a collection "users" in db.collections
