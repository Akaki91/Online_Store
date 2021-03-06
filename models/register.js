const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcrypt')

router.use(bodyParser.urlencoded({ extended: false }))


const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String
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
    const salt = await bcrypt.genSalt(10)
    account.password = await bcrypt.hash(account.password, salt)

    await account.save()
    return res.status(200).json('You have registered sucessfully. Please Sign In below')
})


function validateAccount(account) {
    const schema = {
        name: Joi.string().min(4).max(50).required(),
        id: Joi.string(),
        email: Joi.string().min(4).max(50).required().email(),
        password: Joi.string().min(4).max(50).required(),
    }

    return Joi.validate(account, schema)
}




exports.Account = Account
exports.register = router