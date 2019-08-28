var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
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
    // payment_method: String,
    // password: String,
    // img: String,
    // takeout_1: String,
    // info: {
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Info"
    //     },
    // },
    state: Number,
    file: String,
    googleId: String,
    takeout_1: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Takeout"
        },
        content: String
    },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema); // db.collections 中创建一个集合 users
