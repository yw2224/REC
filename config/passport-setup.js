var passport              = require("passport"),
    keys                  = require("./keys"),
    GoogleStrategy        = require( 'passport-google-oauth2' ).Strategy,
    User                  = require("../models/user");

// var GoogleDriveStrategy = require('passport-google-drive').Strategy;


// to cookie
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// from cookie
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        done(null, user);
    });
})

passport.use(new GoogleStrategy({
    // consumerKey: "1021222270760-o4opjt5b9ejea92voiiblnaoevfjoelo.apps.googleusercontent.com",
    // consumerSecret: "HAqFrTAPazqpThcmhbEme_Xw",
    clientID:     keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "/auth/google/callback",
}, function(request, accessToken, refreshToken, profile, done) {
    // console.log("accessToken");
    // console.log(accessToken);
    // console.log("refreshToken");
    // console.log(refreshToken);
    // console.log(request);
    User.findOne({googleId: profile.id}, function(err, user) {
        if(user) {
            console.log("user is:", user);
            done(null, user);
        } else {
            user = new User({
                username: profile.displayName,
                googleId: profile.id
            });
            user.save(function(err, user) {
                if (err) console.log(err);
                return done(err, user);
            });
        }
    });
}));


passport.use('google-drive', new GoogleStrategy({
    // consumerKey: "1021222270760-o4opjt5b9ejea92voiiblnaoevfjoelo.apps.googleusercontent.com",
    // consumerSecret: "HAqFrTAPazqpThcmhbEme_Xw",
    clientID:     keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "/auth/drive/callback",
}, function(request, accessToken, refreshToken, profile, done) {
    console.log("access Token!!!");
    console.log(accessToken);
    done(null, refreshToken);
}));


// passport.use(new GoogleDriveStrategy({
//     clientID:     keys.google.clientID,
//     clientSecret: keys.google.clientSecret,
//     callbackURL: "/auth/drive/callback"
//   },
//   function (accessToken, refreshToken, profile, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {
//
//       // To keep the example simple, the user's Google profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the Google account with a user record in your database,
//       // and return that user instead.
//       return done(null, profile);
//     });
//   }
// ));
