const router               = require("express").Router(),
      passport             = require("passport");


router.get('/drive', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/drive.readonly']
}));

router.get('/google/callback', passport.authenticate('google'), function(req, res) {
    console.log(req.user);
      // res.send("you are here!")
      // Successful authentication, redirect home.
    res.redirect('/');
});


module.exports = router;
