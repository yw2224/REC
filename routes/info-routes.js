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

const id = {
    "Education": 27,
    "Film & animation": 1,
    "Gaming": 20,
    "News & Politics": 25,
    "People & Blogs": 22,
    "Entertainment": 24,
    "Animals": 15,
    "How-to & Style": 26,
    "Nonprofits & Activism": 29,
    "Sports": 17,
    "Family": 37,
    "Comedy": 23,
    "Music": 10,
    "Science & Technology": 28,
    "Travel & Events": 19,
};

var counter = 0;
router.post("/upload/memory", authCheck, function(req, res) {
    req.user.memories = JSON.parse(req.body.memories).memories;



    req.user.save(function(err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log("User memory saved:\n" + req.user);
            var email = req.user.email, name = req.user.preferredName;
            var intentions = req.user.intentions, memories = req.user.memories;
            var data = counter + "," + email + "," + name + ",";
            for (var i = 0; i < intentions.length; i++) {
                data += id[intentions[i]] + ":";
            }
            data += ",";
            for (var i = 0; i < memories.length; i++) {
                data += id[memories[i]] + ":";
            }
            data += ",,\n";
            console.log(data);

            var dirname = process.cwd() + "/DATA";
            var fs = require('fs');
            if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
            fs.appendFile(dirname + '/user.txt', data, function (err) {
                if (err) throw err;
                console.log("Output for user " + req.user.id + " saved.");
                counter += 1;
            });

        }
    });
    console.log(counter);
});

module.exports = router;
