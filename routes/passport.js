const express = require('express')
const router = express.Router()
const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
// const { Account } = require('../models/register')
const bodyParser = require('body-parser')
const keys = require('../config/keys')

router.use(bodyParser.urlencoded({ extended: false }))

// passport.use(new LocalStrategy(
//     function (username, password, done) {

//         Account.findOne({username: username}, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (user.password != password) { return done(null, false); }
//             return done(null, user);
//         });
//     }
// ));


//------------facebook-login--------

passport.use(new FacebookStrategy({
    clientID: keys.faceboookclientID,
    clientSecret: keys.facebookclientSecret,
    callbackURL: "/login/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
        done(null, {
            id: profile.id,
            displayName: profile.displayName
        })
    }
));


passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user))
})

passport.deserializeUser(function (user, done) {
    done(null, JSON.parse(user))
})


module.exports = passport