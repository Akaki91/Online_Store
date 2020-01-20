const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')
const auth = require('../middleware/login')
const admin = require('../middleware/admin')

router.use(bodyParser.urlencoded({ extended: false }))

let cart = [
    {
        id: "jadkok",
        title: "Evening Dress",
        img: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/J/YJ298-00X-001.jpg",
        size: "XS",
        price: 15,
        quantity: 1
    },
    {
        title: "T-shirt",
        img: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/J/YJ298-00X-003.jpg",
        size: "S",
        price: 12,
        quantity: 1
    },
    {
        title: "T-shirt",
        img: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/F/YF709-99X-001.jpg",
        size: "M",
        price: 17,
        quantity: 1
    }
]


router.get("/", (req, res) => {
    


    res.render("cart.html", {cart})
})

router.post("/add", (req, res) => {
    // let obj = {
    //     _id: req.body.id,
    //     size: req.body.size
    // }

    res.status(200).json(req.body)
})


const Cart = mongoose.model('Cart', new mongoose.Schema({
    item: [mongoose.Schema.Types.ObjectId],
    title: String,
    price: Number,
    rating: Number,
    discount: mongoose.Schema.Types.Decimal128,
    sale: Boolean,
    color: String,
    colors: [String],
    inStock: Object
}))


module.exports = router