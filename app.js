const express               = require("express"),
      mongoose              = require("mongoose"),
      bodyParser            = require("body-parser"),
      User                  = require("./models/user"),
      authRoutes            = require("./routes/auth-routes.js"),
      profileRoutes         = require("./routes/profile-routes.js"),
      uploadRoutes          = require("./routes/upload-routes.js")
      keys                  = require("./config/keys"),
      passport              = require("passport"),
      passportSetup         = require("./config/passport-setup.js"),
      cookieSession         = require("cookie-session");

mongoose.connect(keys.mongo.mongoURI);

var app = express();

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use("/auth", authRoutes);
app.use(uploadRoutes);
// app.use(profileRoutes);

app.get("/", function(req, res){
    res.render("index");
});

// app.get("/generic", function(req, res){
//     res.render("generic");
// });




app.listen(3000, 'localhost', function(){
    console.log("Server started.......");
})
