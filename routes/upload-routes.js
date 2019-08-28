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
var JSAlert = require("js-alert");
var flash        = require('req-flash');
var GridFsStorage = require('multer-gridfs-storage');
var zlib = require('zlib');


router.use(bodyParser.text());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
// router.use(flash());

mongoose.connect(keys.mongo.mongoURI);
const conn = mongoose.createConnection(keys.mongo.mongoURI);

let gfs;
let bucket;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    bucket = new mongoose.mongo.GridFSBucket(conn.db);
});


// const writeStream = gridFSBucket.openUploadStream('test.dat');
// const storage = require('multer-gridfs-storage')({
//    url: keys.mongo.mongoURI
// });

// var storage = GridFsStorage({
//        url: keys.mongo.mongoURI,
//        gfs : gfs,
//        filename: function (req, file, cb) {
//            console.log("i am file:" + file);
//            console.log("i am req:" + req);
//            // var datetimestamp = Date.now();
//            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
//        },
//        /** With gridfs we can store aditional meta-data along with the file */
//        metadata: function(req, file, cb) {
//            console.log("i am req1:" + req);
//            cb(null, { originalname: file.originalname });
//        },
//        // root: 'ctFiles' //root name for collection to store files into
//    });
const storage = new GridFsStorage({
  url: keys.mongo.mongoURI,
  file: (req, file) => {
      console.log("i am rreqqq:")
      console.log(req.user);
      console.log(file);
    return new Promise((resolve, reject) => {
      // crypto.randomBytes(16, (err, buf) => {
      //   if (err) {
      //     return reject(err);
      //   }
      //   const filename = buf.toString('hex') + path.extname(file.originalname);
      //   const fileInfo = {
      //     filename: filename,
      //     // bucketName: 'uploads'
      //   };
        // resolve(fileInfo);
        resolve(file);
      // });
    });
  }
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

router.get("/generic", authCheck, function(req, res) {
    res.render("generic", {user: req.user});
});

router.get("/temp", authCheck, function(req, res) {
    res.render("temp", {user: req.user});
});


// const upload = multer({ dest: './models/uploads' });
const upload = multer({storage: storage}); //upload.single("localFileName"),
router.post("/upload/local", authCheck, upload.single("localFileName"),function(req, res) {
    console.log("Getting file:");
    console.log(req.user);
    console.log(req);
    // console.log(req.file.id);
    console.log(req.body.file);
    req.user.takeout1Id = req.file.id;
    req.user.save();
    console.log(req.user.takeout1Id);
    res.send("I'm not a teapot! :O");
})



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


// const archiver = require('archiver');
//
// function zipDirectory(source, out) {
//   const archive = archiver('zip', { zlib: { level: 9 }});
//   const stream = fs.createWriteStream(out);
//
//   return new Promise((resolve, reject) => {
//     archive
//       .directory(source, false)
//       .on('error', err => reject(err))
//       .pipe(stream)
//     ;
//
//     stream.on('close', () => resolve());
//     archive.finalize();
//   });
// }


router.post("/upload/drive", authCheck, function(req, res){
    console.log("upload drive");

    var content = JSON.parse(req.body);
    var token = content.token;
    oAuth2Client.setCredentials(token);

    const drive = google.drive({version: 'v3', oAuth2Client});
    const options = {encoding:'utf-8', flag:'w'};
    var fileId = content.docID; //'1ZdR3L3qP4Bkq8noWLJHSr_iBau0DNT4Kli4SxNc2YEo';
    var fileURL = content.docURL;

    var filePath = "./out";
    // const dest = fs.createWriteStream(filePath);
    let progress = 0;
    // For converting document formats, and for downloading template
    // documents, see the method drive.files.export():
    // https://developers.google.com/drive/api/v3/manage-downloads

    // fs.createReadStream('./meistersinger.mp3').
    // pipe(bucket.openUploadStream('meistersinger.mp3')).
    // on('error', function(error) {
    //   assert.ifError(error);
    // }).
    // on('finish', function() {
    //   console.log('done!');
    //   process.exit(0);
    // });

    // var dest = fs.createWriteStream('./models/uploads/test.zip');
    var user = req.user;
    drive.files.get({
        auth: oAuth2Client,
        fileId: fileId,
        alt: 'media',
        fields: '*',
        mimeType: 'application/gzip',
    },  {responseType: 'stream'}, function(err, res) {
        console.log(res);
        res.data
        .on('end', () => {
            console.log('Done');
        })
        .on('error', err => {
            console.log('Error', err);
        })
        .pipe(bucket.openUploadStream('meistersinger.mp3'));

        // if (err) return console.log('The API returned an error: ' + err);
        // process.stdout.write(fileName);
        // const filePath = `${targetPath}/${fileName}`;
        // fs.writeFileSync('./models/uploads/aaaaa.zip', res.data, options);

    });
});

module.exports = router;
