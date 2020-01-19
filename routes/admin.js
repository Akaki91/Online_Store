const express = require('express')
const router = express.Router()
const auth = require('../middleware/login')
const admin = require('../middleware/admin')
const { Item } = require('./products')
const { Account } = require('./register')

router.get('/', [auth, admin], (req, res) => {
    res.render('admin.html')
})

router.get('/add', [auth, admin], (req, res) => {
    res.render('addproduct.html')
})

router.get('/all', [auth, admin], async (req, res) => {
    const items = await Item.find().sort('item')
    res.render('dtbase-item.html', { items })
})

router.get('/accounts', [auth, admin], async (req, res) => {
    const users = await Account.find();
    res.render('dtbase-user.html', { users })
})

module.exports = router