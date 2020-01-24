const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const auth = require('../middleware/login')
const Cart = require('../models/cart')
const { Item } = require('../models/item')

router.use(bodyParser.urlencoded({ extended: false }))


router.get("/", (req, res) => {
    
    let cart = new Cart(req.session.cart ? req.session.cart : [])

    res.render("cart.html", { cart })
})


router.get("/checkout", auth, (req, res) => {

    res.render("checkout.html")
})

router.post("/add", async (req, res) => {

    let cart = new Cart(req.session.cart ? req.session.cart : [])
    
    const item = await Item.findById(req.body.id)
    if (!item) return res.status(400).json('Item is no longer available')
    
    cart.add(req.body.id, req.body.size, req.body.color, item.title, item.image1, item.price)
    req.session.cart = cart
    
    res.status(200).json("Item has been added to the cart")
})


router.post("/delete", (req, res) => {

    let cart = new Cart(req.session.cart)
    cart.remove(req.body.id, req.body.size)
    req.session.cart = cart

    res.status(200).redirect('/cart')
})


router.post("/update", (req, res) => { 

    let cart = new Cart(req.session.cart)

    let qty = Number(req.body.qty)
    cart.update(req.body.id, req.body.size, qty)
    req.session.cart = cart
    
    res.status(200).redirect('/cart')
})







module.exports = router