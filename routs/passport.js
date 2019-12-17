const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
    function (username, password, done) {
        if (username != 'akaki') {
            return done(null, false, { message: 'Incorrect username' })
        }
        if (password != '1234') {
            return done(null, false, { message: 'Incorrect password' })
        }

        return done(null, {
            username: 'akaki',
            name: 'Jemal',
            email: 'jemal@yahoo.com'
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})


module.exports = passport