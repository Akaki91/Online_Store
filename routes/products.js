const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')
const auth = require('../middleware/login')
const admin = require('../middleware/admin')
// const asyncMiddleware = require('../middleware/async')

router.use(bodyParser.urlencoded({ extended: false }))

const Product = mongoose.model('Product', new mongoose.Schema({
    category: String,
    item: String,
    description: String,
    size: String,
    price: Number
}))

function validate(req) {
    const schema = {
        category: Joi.string().required(),
        item: Joi.string().required(),
        description: Joi.string().required(),
        size: Joi.string().required(),
        price: Joi.number().required()
    };

    return Joi.validate(req, schema);
}


router.get('/', async (req, res) => {
    // throw new Error('Sorry')
    const items = await Product.find().sort('product');
    res.send(items)
})


router.get('/add', async (req, res) => {
    res.render('addproduct.html')
})


router.post('/add', [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    let product = new Product({ 
        category: req.body.category,
        item: req.body.item,
        description: req.body.description,
        size: req.body.size,
        price: req.body.price
    })

    try {
        product = await product.save()
        console.log(product);
        res.redirect('/products')
    }
    catch (ex) {
        for (field in ex.errors)
        console.log(ex.errors[field].message);
    }
})



  
module.exports = router