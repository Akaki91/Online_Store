const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')


router.use(bodyParser.urlencoded({ extended: false }))


const accountSchema = new mongoose.Schema({
    username: {
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
    }
})

const Account = mongoose.model('Account', accountSchema)

function validateAccount(account) {
    const schema = {
        username: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(4).max(50).required().email(),
        password: Joi.string().min(4).max(50).required(),
    }

    return Joi.validate(account, schema)
}


router.get('/', (req, res) => {
    res.render('register.html')
})

router.post('/', async (req, res) => {

    const { error } = validateAccount(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    let user = await Account.findOne({email: req.body.email})
    if (user) return res.status(400).send('User is already registered')

    let account = new Account({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })

    await account.save()

    res.send('Your account has been saved. please login')
})

// module.exports = router

exports.Account = Account
exports.register = router