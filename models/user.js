var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

const seasons = {
    SUMMER: 'summer',
    WINTER: 'winter',
    SPRING: 'spring',
    AUTUMN: 'autumn'
}

var UserSchema = new mongoose.Schema({
    username: String,
    // payment_method: String,
    // password: String,
    // img: String,
    // takeout_1: String,
    takeout_2: String,
    state: Number,
    file: String,
    googleId: String,
    takeout_1: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Takeout"
        },
        content: String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema); // db.collections 中创建一个集合 users
