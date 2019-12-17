const express = require('express')
const router = express.Router()
const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const FileStore = require('session-file-store')(session)


router.use(passport.initialize());
router.use(passport.session())

router.use(session({
    store: new FileStore({
        encoder: JSON.stringify
    }),
    secret: 'KOEAKDOE'
}))

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, JSON.parse(user))
})

passport.use(new LocalStrategy(
    function (username, password, done) {
        if (username != 'akaki ') {
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

router.get('/', (req, res) => {
    res.render('login.html')
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}))




module.exports = router