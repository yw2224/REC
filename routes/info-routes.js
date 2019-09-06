const router                = require("express").Router(),
      keys                  = require("../config/keys"),
      mongoose              = require("mongoose");
const busboyBodyParser = require('busboy-body-parser');
router.use(busboyBodyParser());

const authCheck = function(req, res, next) {
    if(!req.user) {
        console.log("redirecting...");
        res.redirect("/");
    } else {
        next();
    }
};

router.post("/upload/info", authCheck, function(req, res) {
    req.user.preferredName = req.body.preferredName;
    req.user.visitFrequency = req.body.visitFrequency;
    req.user.timeSlots = JSON.parse(req.body.timeSlots).timeSlots;
    req.user.feelAboutYoutubeRec = req.body.feelAboutYoutubeRec;
    req.user.recWatchFrequency = req.body.recWatchFrequency;
    req.user.purposes = JSON.parse(req.body.purposes).purposes;
    req.user.occupation = req.body.occupation;
    req.user.politicalAttitude = req.body.politicalAttitude;
    req.user.takeout1ID = mongoose.Schema.Types.ObjectId("");
    req.user.takeout2ID = mongoose.Schema.Types.ObjectId("");

    req.user.save(function(err, user) {
        if (err) console.log(err);
        else console.log("Saving user info:\n" + req.user);
    });
});

router.post("/upload/intention", authCheck, function(req, res) {
    req.user.intentions = JSON.parse(req.body.intentions).intentions;
    req.user.save(function(err, user) {
        if (err) console.log(err);
        else console.log("User intention saved:\n" + req.user);
    });
});

router.post("/upload/memory", authCheck, function(req, res) {
    req.user.memories = JSON.parse(req.body.memories).memories;
    req.user.save(function(err, user) {
        if (err) console.log(err);
        else console.log("User memory saved:\n" + req.user);
    });
});

module.exports = router;
