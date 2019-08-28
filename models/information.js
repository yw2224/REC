var mongoose = require("mongoose");

const seasons = {
    SUMMER: 'summer',
    WINTER: 'winter',
    SPRING: 'spring',
    AUTUMN: 'autumn'
}

var infoSchema = mongoose.Schema({
    preferredName: String,
    // visitFrequency: seasons,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Info", infoSchema);
