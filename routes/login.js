const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('./passport')

router.use(bodyParser.urlencoded({ extended: false }))

router.use(session({
    store: new FileStore({
        encoder: JSON.stringify
    }),
    resave: true,
    saveUninitialized: true,
    secret: 'KOEAKDOE'
}))

router.use(passport.initialize());
router.use(passport.session())

router.get('/', (req, res) => {
    res.render('login.html')
})

router.post('/', passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/profile');
})



//-------------------------------
//facebook login

router.get('/facebook',
    passport.authenticate('facebook', {scope: ['email']})
);

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: 'login'
    }))


//----------------------

module.exports = router
