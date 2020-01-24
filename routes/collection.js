const express = require('express')
const router = express.Router()
const { Item } = require('../models/item')


router.get('/', async (req, res) => {

    let items

    if (req.query.sort === "downsort") {
        delete req.query.sort
        items = await Item.find(req.query).sort({ price: -1 });
    }
    else if (req.query.sort === "upsort") {
        delete req.query.sort
        items = await Item.find(req.query).sort({ price: +1 })
    }
    else {
        items = await Item.find(req.query);
    }

    res.render('collection.html', { items })
})


router.get('/:id', async (req, res) => {
    const item = await Item.findById(req.params.id)

    res.render('item.html', { item })
})


module.exports = router