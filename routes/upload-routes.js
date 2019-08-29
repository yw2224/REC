const router                = require("express").Router(),
      keys                  = require("../config/keys"),
      bodyParser            = require("body-parser");
router.use(bodyParser.json());
const fs                    = require("fs"),
      multer                = require('multer'),
      mongoose              = require("mongoose"),
      Grid                  = require('gridfs-stream'),
      GridFsStorage = require('multer-gridfs-storage'),
      {google}              = require('googleapis');

const authCheck = function(req, res, next) {
  if(!req.user) {
      console.log("redirecting...");
      res.redirect("/");
  } else {
      next();
  }
};

let gfs, bucket;
const conn = mongoose.createConnection(keys.mongo.mongoURI);
conn.once('open', function() {
    gfs = Grid(conn.db, mongoose.mongo);
    bucket = new mongoose.mongo.GridFSBucket(conn.db);
});

// storage engine for multer
const storage = new GridFsStorage({
    url: keys.mongo.mongoURI,
    file: function(req, file) {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                metadata: req.user.id,
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({storage: storage});
router.post("/upload/local", authCheck, upload.single("localFileName"),function(req, res) {
    console.log("Uploading local file:");
    req.user.takeout1Id = req.file.id;
    var response = res;
    req.user.save(function(err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log("File " + user.takeout1Id + " saved for user:\n" + user);
            response.send("Success!");
        }
    });
})

router.post("/upload/drive", authCheck, function(req, res){
    var content = req.body;
    const oAuth2Client = new google.auth.OAuth2(
        keys.google.clientID,
        keys.google.clientSecret,
        "/auth/google/callback"
    );
    oAuth2Client.setCredentials(content.token);
    const drive = google.drive({version: 'v3', oAuth2Client});
    var fileId = content.docID, fileURL = content.docURL;

    console.log("Drive file selected: " + content.docName);
    var dest = bucket.openUploadStream(content.docName, {metadata: req.user.id});
    var user = req.user, response = res;
    drive.files.get({
        auth: oAuth2Client,
        fileId: fileId,
        alt: 'media',
        fields: '*',
    },  {responseType: 'stream'}, function(err, res) {
        console.log("Uploading drive file.\n");
        res.data
        .on('end', function() {
            user.takeout1Id = dest.id;
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                    response.send("Fail. Please try again.");
                } else {
                    console.log("File " + user.takeout1Id + " saved for user:\n" + user);
                    response.send("Success!");
                }
            });
        })
        .on('error', function(err) {
            console.log(err);
            response.send("Fail. Please try again.");
        })
        .pipe(dest);
    });
});

router.get('/upload/secret', function(req, res){
    // gfs.collection('rec'); //set collection name to lookup into

    /** First check if file exists */
    gfs.files.find({_id: req.user.takeout1Id}).toArray(function(err, files){
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        /** create read stream */
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            // root: "ctFiles"
        });
        var dest = fs.createWriteStream('./models/uploads/ttttest.zip');
        /** set the proper content type */
        // res.set('Content-Type', files[0].contentType)
        /** return response */
        return readstream.pipe(dest);
    });
});

module.exports = router;
