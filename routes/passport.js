const express = require('express')
const router = express.Router()
const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
// const { Account } = require('../models/register')
const bodyParser = require('body-parser')
const 

router.use(bodyParser.urlencoded({ extended: false }))

//------------facebook-login--------

passport.use(new FacebookStrategy({
    clientID: 2571861736184746,
    clientSecret: config.get("facebookSecret"),
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