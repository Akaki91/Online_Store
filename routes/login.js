const express = require('express')
const router = express.Router() 
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('./passport')
const { Account } = require('../models/register')
const Joi = require('joi')
const bcrypt = require('bcrypt')

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
    

    let user = await Account.findOne({ email: req.body.email});
    if (!user) return res.status(400).json('Invalid email or password')
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).json('Invalid email or password')

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
    passport.authenticate('facebook', { scope: 'email' }), 
    
    async (req, res) => {

        console.log();
        

        let account = await Account.findOne({ id: req.user.id })
        if (!account) {
            account = new Account({
                id: req.user.id,
                name: req.user.displayName,
                email: (req.user.displayName + '@' + req.user.provider + '.com'), 
                password: 1234
            })
            
            await account.save()
        } 
        
        

        const token = account.generateAuthToken()

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
