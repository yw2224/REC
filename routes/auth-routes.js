const router               = require("express").Router(),
      passport             = require("passport");


router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/callback', passport.authenticate('google'), function(req, res) {
    console.log(req.user);
      // res.send("you are here!")
      // Successful authentication, redirect home.
    res.redirect('/generic');
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;
