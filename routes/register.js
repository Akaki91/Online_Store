const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')


router.use(bodyParser.urlencoded({ extended: false }))


const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: Boolean
})

accountSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
    return token
}


const Account = mongoose.model('Account', accountSchema)


router.post('/', async (req, res) => {

    const { error } = validateAccount(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message)
    }

    let user = await Account.findOne({email: req.body.email})
    if (user) return res.status(400).json('User is already registered')

    let account = new Account({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })

    await account.save()
    return res.status(200).json('You have registered sucessfully. Please Sign In below')
    // const token = account.generateAuthToken()

    // res.header('x-auth-token', token)
    // res.redirect('/profile')
    //.send('Your account has been saved. please login')
})


function validateAccount(account) {
    const schema = {
        name: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(4).max(50).required().email(),
        password: Joi.string().min(4).max(50).required(),
    }

    return Joi.validate(account, schema)
}


// // router.get('/me', async (req, res) => )



exports.Account = Account
exports.register = router