const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')


router.use(bodyParser.urlencoded({ extended: false }))

const Product = mongoose.model('Product', new mongoose.Schema({
    category: String,
    item: String,
    description: String,
    size: String,
    price: Number
}))

// function validateProduct(product) {
//     const schema = {
//         item: Joi.string().required()
//     };

//     return Joi.validate(product, schema);
// }
 
router.get('/', async (req, res) => {
    const products = await Product.find().sort('product');
    res.send(products)
})


router.get('/add', async (req, res) => {
    res.render('addproduct.html')
})


router.post('/add', async (req, res) => {
    // const { error } = validateProduct(req.body)
    // if (error) {
    //     return res.status(400).send(error.details[0].message)
    // }

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