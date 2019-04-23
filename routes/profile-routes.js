const router = require("express").Router();

const authCheck = function(req, res, next) {
    if(!req.user) {
        console.log("redirecting...");
        res.redirect("/");
    } else {
        next();
    }
};

router.get("/generic", authCheck, function(req, res) {
    console.log("You are logged in!" + req.user);
    res.render("generic", {user: req.user});
});

module.exports = router;
