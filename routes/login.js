const express = require('express')
const router = express.Router() 
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('./passport')
const { Account } = require('../models/register')
const Joi = require('joi')

router.use(bodyParser.urlencoded({ extended: false }))


//----------passport-login--------------------------------

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

//--------------------------------------------------------

router.post('/', async (req, res) => {
    const { error } = validate (req.body);

    if (error) {
        return res.status(400).json(error.details[0].message);
    }
    

    let user = await Account.findOne({ email: req.body.email, password: req.body.password});
    if (!user) return res.status(400).json('Invalid email or password')
    
    const token =  user.generateAuthToken()
    
    res.cookie('jwt', token, {maxAge: 7 * 24 * 3600 * 1000});
    res.redirect('/profile');
})


//-------------------------------
//facebook login

router.get('/facebook',
    passport.authenticate('facebook', { scope: 'email'})
);

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/', successRedirect: '/profile'}),
    
    async (req, res) => {


        // let user = await Account.findOne({ name: req.user.displayName, })
        // if (!user) {
        //     user = new Account({
        //         name: req.user.displayName,
        //         // id: req.user.id,
        //         email: "tes@test.com",
        //         password: 1234
        //     })
        //     await user.save()
        // }
        
        let user = new Account({
            name: req.user.displayName,
            // id: req.user.id,
            email: "tes@test.com",
            password: 1234
        })

        await user.save()

        const token = user.generateAuthToken()

        res.cookie('jwt', token, { maxAge: 7 * 24 * 3600 * 1000 });
        res.redirect('/profile');

    })

//----------------------

function validate(req) {
    const schema = {
        email: Joi.string().min(4).max(50).required().email(),
        password: Joi.string().min(4).max(50).required(),
    }

    return Joi.validate(req, schema)
}


module.exports = router
