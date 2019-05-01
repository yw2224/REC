const router               = require("express").Router(),
      passport             = require("passport");
const {google} = require('googleapis');


router.get('/google', passport.authenticate('google', {
    accessType: 'offline',
    prompt: 'consent',
    scope: ['profile', 'https://www.googleapis.com/auth/drive.file']
}));

router.get('/google/callback', passport.authenticate('google'), function(req, res) {
    console.log(req.user);
      // res.send("you are here!")
      // Successful authentication, redirect home.
    res.redirect('/generic');
});

router.get('/drive', passport.authenticate('google-drive', {
    // scope: ['https://www.googleapis.com/auth/drive.readonly']
    accessType: 'offline',
    prompt: 'consent',
    scope: ['profile', 'https://www.googleapis.com/auth/drive.file']
}));

function listFiles(auth) {
    console.log(auth)
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}
router.get('/drive/callback', passport.authorize('google-drive'), function(req, res) {
    console.log("you are here!");
    console.log(req.account);
    var token = req.account;
    const oAuth2Client = new google.auth.OAuth2(
      "1021222270760-o4opjt5b9ejea92voiiblnaoevfjoelo.apps.googleusercontent.com",
      "HAqFrTAPazqpThcmhbEme_Xw",
      "/auth/google/callback"
    );
    oAuth2Client.setCredentials(token);
    listFiles(oAuth2Client);
    // console.log(req.account);
    // const files = res.data.files;
    // if (files.length) {
    //   console.log('Files:');
    //   files.map((file) => {
    //     console.log(`${file.name} (${file.id})`);
    //   });
    // } else {
    //   console.log('No files found.');
    // }

      // Successful authentication, redirect home.
    res.redirect('/');
});


// router.get('/drive', passport.authenticate('google', {
//     scope: ['https://www.googleapis.com/auth/drive.readonly']
// }));
//
//
// router.get('/drive/callback', passport.authenticate('google'), function (req, res) {
//     res.redirect('/');
// });


router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;
