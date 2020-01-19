const express = require('express')
const router = express.Router()
const auth = require('../middleware/login')
const { Account } = require('./register')


router.get('/', auth, async (req, res) => {
    const user = await Account.findById(req.user._id).select('-password')
    res.render('profiledet.html', { user })
})

router.get('/orders', auth, (req, res) => {
    res.render('profileord.html')
})

router.get('/changepass', auth, (req, res) => {
    res.render('changepass.html')
})

router.post('/changepass', (req, res) => {
    res.send('done') //needs to be updated
})

router.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/')
})


module.exports = router