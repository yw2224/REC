const router = require("express").Router();
const {google} = require('googleapis');
const keys                  = require("../config/keys");
const bodyParser            = require("body-parser");
const User                  = require("../models/user");
const Takeout = require("../models/takeout");
const fs = require("fs");

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

router.use(bodyParser.text());

router.post("/upload/local", authCheck, function(req, res) {
    var src = req.body.filename;
    console.log(req.body);
    console.log("????");
    var writestream = gfs.createWriteStream({
            filename: './out.png'
        });
        // writeStream.write(data);
    fs.createReadStream(src).pipe(writestream);
})

router.get("/generic", authCheck, function(req, res) {
    console.log("You are logged in!" + req.user);
    res.render("generic", {user: req.user});
});

router.get("/picker", authCheck, function(req, res) {
    console.log("You are logged in!" + req.user);
    res.render("picker", {user: req.user});
});

async function runSample(drive, fileId) {
  return new Promise(async (resolve, reject) => {
    const filePath = "../out.png"
    console.log(`writing to ${filePath}`);
    const dest = fs.createWriteStream(filePath);
    let progress = 0;
    // For converting document formats, and for downloading template
    // documents, see the method drive.files.export():
    // https://developers.google.com/drive/api/v3/manage-downloads
    const res = await drive.files.get(
      {fileId, alt: 'media'},
      {responseType: 'stream'}
    );
    res.data
      .on('end', () => {
        console.log('Done downloading file.');
        resolve(filePath);
      })
      .on('error', err => {
        console.error('Error downloading file.');
        reject(err);
      })
      .on('data', d => {
        progress += d.length;
        if (process.stdout.isTTY) {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(`Downloaded ${progress} bytes`);
        }
      })
      .pipe(dest);
  });
}

router.post("/upload", authCheck, function(req, res){
    console.log("upload called");
    console.log(req.user);

    var content = JSON.parse(req.body);
    // console.log(content);
    var token = content.token;
    oAuth2Client.setCredentials(token);

    const drive = google.drive({version: 'v3', oAuth2Client});
    var fileId = content.docID; //'1ZdR3L3qP4Bkq8noWLJHSr_iBau0DNT4Kli4SxNc2YEo';
    var fileURL = content.docURL;

    const dest = fs.createWriteStream('../out.png');
    runSample(drive, fileId);
    // var dest = fs.createWriteStream('../out.png');
    // drive.files.get({
    //     auth: oAuth2Client,
    //     fileId: fileId,
    //     alt: 'media'
    // })
    // .on('end', function () {
    //   console.log('Done');
    // })
    // .on('error', function (err) {
    //   console.log('Error during download', err);
    // })
    // .pipe(dest);

    // User.findOne({googleId: req.user.id}, function(err, user) {
    //     if(err) {
    //         console.log(err);
    //         res.redirect("/generic");
    //     } else {
    //         // takeout = new Takeout({
    //         //     // author.id = req.user._id,
    //         //     // author.username = req.user.username,
    //         //     text = req.body.data
    //         // });
    //         // console.log(takeout);
    //         drive.files.get({
    //             auth: oAuth2Client,
    //             fileId: fileId,
    //             alt: 'media'
    //         }, function(error, res) {
    //             var data = res.data;
    //             // console.log(data);
    //             var takeout = new Takeout({
    //                 // author[id]: req.user._id,
    //                 // author[username]: req.user.username,
    //                 text: data
    //             });
    //             console.log("this is takeout");
    //             console.log(takeout);
    //
    //             // takeout.author.id = req.user._id;
    //             // takeout.author.username = req.user.username;
    //
    //             takeout.save();
    //             // user.takeout_1 = takeout;
    //             // user.save();
    //
    //         });
    //         // console.log(req.body.data);
    //
    //
    //         // Takeout.create(req.body.data, function(err, takeout) {
    //         //     if(err) {
    //         //         console.log(err);
    //         //     } else {
    //         //         takeout.author.id = req.user._id;
    //         //         takeout.author.username = req.user.username;
    //         //         console.log(takeout);
    //         //
    //         //         takeout.save();
    //         //         user.takeout_1 = takeout;
    //         //         user.save();
    //         //         console.log(takeout);
    //         //     }
    //         // })
    //     }
    // });
    // var content = JSON.parse(req.body);
    // console.log(content);
    // var token = content.token;
    // oAuth2Client.setCredentials(token);
    //
    // const drive = google.drive({version: 'v3', oAuth2Client});
    // var fileId = content.docID; //'1ZdR3L3qP4Bkq8noWLJHSr_iBau0DNT4Kli4SxNc2YEo';
    // var fileURL = content.docURL;
    //
    // // var dest = fs.createWriteStream('./resume.zip');
    //
    // drive.files.get({
    //     auth: oAuth2Client,
    //     fileId: fileId,
    //     alt: 'media'
    // }, function(error, res) {
    //     var data = res.data;
    //     console.log(data);
    //     // gfs.put(buffer, {metadata:{category:'text'}, content_type: 'text'}, function(err, fileInfo) {
    //     //     if(!err) {
    //     //         console.log("Finished writing file to Mongo");
    //     //     }
    // });
    //
    //     console.log("res !!1");

    });

module.exports = router;
