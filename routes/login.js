const express = require('express')
const router = express.Router() 
const bodyParser = require('body-parser')
const session = require('express-session')
// const FileStore = require('session-file-store')(session)
const passport = require('./passport')
const { Account } = require('./register')
const Joi = require('joi')

router.use(bodyParser.urlencoded({ extended: false }))


//----------passport-login--------------------------------

// router.use(session({
//     store: new FileStore({
//         encoder: JSON.stringify
//     }),
//     resave: true,
//     saveUninitialized: true,
//     secret: 'KOEAKDOE'
// }))

// router.use(passport.initialize());
// router.use(passport.session())

//--------------------------------------------------------

router.post('/', async (req, res) => {
    const { error } = validate (req.body);
    if (error) return res.status(400).send(error.details[0].message)

    let user = await Account.findOne({ email: req.body.email, password: req.body.password});
    if (!user) return res.status(400).send('Invalid email or password')

    const token =  user.generateAuthToken()
    
    res.send('/profile')
})



//-------------------------------
//facebook login

router.get('/facebook',
    passport.authenticate('facebook', {scope: ['email']})
);

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/login'
    }))


//----------------------

function validate(req) {
    const schema = {
        email: Joi.string().min(4).max(50).required().email(),
        password: Joi.string().min(4).max(50).required(),
    }

    return Joi.validate(req, schema)
}


module.exports = router
