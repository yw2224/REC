const router               = require("express").Router(),
      passport             = require("passport");


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

// router.get('/drive', passport.authenticate('google-drive', {
//     scope: ['https://www.googleapis.com/auth/drive.readonly']
// }));


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
