const router = require("express").Router();
const keys                  = require("../config/keys");
const bodyParser            = require("body-parser");
const User                  = require("../models/user");
const mongoose              = require("mongoose");
const Takeout               = require("../models/takeout");
const fs                    = require("fs");
const Grid                  = require('gridfs-stream');
const multer                = require('multer');
const {google}              = require('googleapis');
const stream                = require('stream');
var str                     = require('string-to-stream')
      var busboyBodyParser = require('busboy-body-parser');

router.use(bodyParser.text());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(busboyBodyParser());

mongoose.connect(keys.mongo.mongoURI);
const conn = mongoose.createConnection(keys.mongo.mongoURI);

let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
});

const authCheck = function(req, res, next) {
    if(!req.user) {
        console.log("redirecting...");
        res.redirect("/");
    } else {
        next();
    }
};

const oAuth2Client = new google.auth.OAuth2(
  keys.google.clientID,
  keys.google.clientSecret,
  "/auth/google/callback"
);


router.post("/upload/info", authCheck, function(req, res) {
    // busboyBodyParser();
    console.log("info:");
    req.user.preferredName = req.body.preferredName;
    req.user.visitFrequency = req.body.visitFrequency;
    req.user.timeSlots = JSON.parse(req.body.timeSlots).timeSlots;
    req.user.feelAboutYoutubeRec = req.body.feelAboutYoutubeRec;
    req.user.recWatchFrequency = req.body.recWatchFrequency;
    req.user.purposes = JSON.parse(req.body.purposes).purposes;
    req.user.occupation = req.body.occupation;
    req.user.politicalAttitude = req.body.politicalAttitude;
    req.user.takeout1ID = mongoose.Schema.Types.ObjectId("");

    req.user.save();
    console.log(req.user);
    console.log(req.params);
    console.log(req.body);
});

router.post("/upload/intention", authCheck, function(req, res) {
    console.log(req.body);

    req.user.intentions = JSON.parse(req.body.intentions).intentions;
    console.log(req.user);
    req.user.save();
});

router.post("/upload/memory", authCheck, function(req, res) {
    console.log(req.body);

    req.user.memories = JSON.parse(req.body.memories).memories;
    console.log(req.user);
    req.user.save();
});

module.exports = router;
