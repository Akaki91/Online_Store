const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')
const auth = require('../middleware/login')
const admin = require('../middleware/admin')
// const asyncMiddleware = require('../middleware/async')

router.use(bodyParser.urlencoded({ extended: false }))

const Item = mongoose.model('Item', new mongoose.Schema({
    category: mongoose.Schema.Types.ObjectId,
    subcategory: String,
    newSeason: Boolean,
    title: String,
    image1: String,
    image2: String,
    image3: String,
    price: Number,
    rating: Number,
    discount: mongoose.Schema.Types.Decimal128,
    sale: Boolean,
    color: String,
    colors: [String],
    inStock: Object 
}))

function validate(req) {
    const schema = {
        category: Joi.string().required(),
        subcategory: Joi.string().required(),
        newSeason: Joi.boolean().required(),
        title: Joi.string().required(),
        image1: Joi.string().required(),
        image2: Joi.string().required(),
        image3: Joi.string().required(),
        price: Joi.number().required(),
        rating: Joi.number().required(),
        discount: Joi.number().required(),
        sale: Joi.boolean().required(),
        color: Joi.string().required(),
        colors: Joi.array().required(),
        inStock: Joi.array().required(),
    };

    return Joi.validate(req, schema);
}


router.post('/add', [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    let keys = ["XS", "S", "M", "L", "XL"]
    result = {}
    keys.forEach((key, i) =>
        result[key] = Number(req.body.inStock[i])
    )

    let item = new Item({ 
        category: req.body.category,
        subcategory: req.body.subcategory,
        newSeason: req.body.newSeason,
        title: req.body.title,
        image1: req.body.image1,
        image2: req.body.image2,
        image3: req.body.image3,
        price: req.body.price,
        rating: req.body.rating,
        discount: req.body.discount,
        sale: req.body.sale,
        color: req.body.color,
        colors: req.body.colors,
        inStock: result,
    })

    try {
        item = await item.save()
        console.log(item);
        res.redirect('/collection')
    }
    catch (ex) {
        for (field in ex.errors)
        console.log(ex.errors[field].message);
    }
})



  
exports.products = router
exports.Item = Item