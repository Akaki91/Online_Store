const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const { Account } = require('./register')
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


// passport.serializeUser(function (user, done) {
//     done(null, JSON.stringify(user))
// })

// passport.deserializeUser(function (user, done) {
//     done(null, JSON.parse(user)) 
// })


//------------facebook-login--------

passport.use(new FacebookStrategy({
    clientID: keys.faceboookclientID,
    clientSecret: keys.facebookclientSecret,
    callbackURL: "http://localhost:3000/login/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
        done(null, {
            id: profile.id,
            displayName: profile.displayName
        })
    }
));

//----------------------------------------------

function validate(req) {
    const schema = {
        email: Joi.string().min(4).max(50).required().email(),
        password: Joi.string().min(4).max(50).required(),
    }

    return Joi.validate(req, schema)
}


module.exports = passport