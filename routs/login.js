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
    secret: 'KOEAKDOE'
}))

router.use(passport.initialize());
router.use(passport.session())

router.get('/', (req, res) => {
    res.render('login.html')
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login' 
}))


module.exports = router