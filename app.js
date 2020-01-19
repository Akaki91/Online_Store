const winston = require('winston')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const login = require('./routes/login')
const { products, Item } = require('./routes/products')
const profile = require('./routes/profile')
const { register } = require('./routes/register')
const adminroute = require('./routes/admin')
const config = require('config')
const error = require('./middleware/error')
const auth = require('./middleware/login')
const admin = require('./middleware/admin')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
require('express-async-errors')


winston.exceptions.handle(
    new winston.transports.Console({colorize: true, prettyPrint: true}),
    new winston.transports.File({filename: 'uncaughtExceptions.log'})
)

process.on('unhandledRejection', (ex) => {
   throw ex;
})

winston.add(new winston.transports.File({filename: 'logfile.log'}))


if (!config.get('jwtPrivateKey')) {
    console.error('Fatal Error: jwtPrivateKey is not defined');
    process.exit(1)
}

mongoose.connect('mongodb://localhost/storeitems', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => winston.info('Connected to MongoDB...'))

app.use(cookieParser());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
})

app.use((req, res, next) => {
    const token = req.cookies.jwt;
    let isAuthorized = false;
    if (token) {
        isAuthorized = jwt.verify(token, config.get('jwtPrivateKey'));
    }
    env.addGlobal('isAuthorized', isAuthorized);
    next();
});

app.use('/login', login)
app.use('/products', products)
app.use('/register', register) 
app.use('/profile', profile)
app.use('/admin', adminroute)
app.use(error)

//----------------------------------------------------------------------

app.get('/', (req, res) => {
    res.render('index.html')
})


itemses = [
    { 
        _id: "botjd232",
        category: "Women",
        newSeason: false,
        title: "girls blouse",
        image1: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/J/YJ298-03X-001.jpg",
        image2: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/J/YJ298-03X-002.jpg",
        image3: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/J/YJ298-03X-004.jpg",
        price: 25,
        rating: 4,
        discount: 0.2,
        sale: true,
        
        
        color: "white",
        colors: ["red", "green"],
        sizes: ["XS", "M"],
        inStock: [3, 0, 4, 0, 0]
    },

    {
        _id: "botjd233",
        title: "girls blouse",
        image1: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/J/YJ298-03X-001.jpg",
        image2: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/J/YJ298-03X-002.jpg",
        image3: "https://www.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/Y/J/YJ298-03X-004.jpg",
        price: 15,
        rating: 4,

        colors: ["black", "red"],
        sizes: ["S", "M"]

    },
    {
        title: "girls blouse",
        image1: "http://bestjquery.com/tutorial/product-grid/demo9/images/img-1.jpg",
        image2: "http://bestjquery.com/tutorial/product-grid/demo9/images/img-2.jpg",
        price: 15,
        rating: 4,

        colors: ["black", "red", "green"],
        size: ["XS", "L"],

    },
    {
        title: "girls blouse",
        image1: "http://bestjquery.com/tutorial/product-grid/demo9/images/img-1.jpg",
        image2: "http://bestjquery.com/tutorial/product-grid/demo9/images/img-2.jpg",
        price: 15,
        rating: 4,

        description: "yada yada",
        colors: ["black"],
        size: "M",

    },
    {
        title: "girls blouse",
        image1: "http://bestjquery.com/tutorial/product-grid/demo9/images/img-1.jpg",
        image2: "http://bestjquery.com/tutorial/product-grid/demo9/images/img-2.jpg",
        price: 15,
        rating: 4,

        description: "yada yada",
        colors: ["black"],
        size: "M",

    }
]


app.get('/collection', async (req, res) => {
    const items = await Item.find().sort('item')

    res.render('collection.html', { items })
})

app.get('/collection/:id', async (req, res) => {
    const item = await Item.findById(req.params.id)

    res.render('item.html', { item } )
})


app.get('/home', async (req, res) => {
    res.send('hi')
})

//-------------------------------------------------------------------


const port = process.env.PORT || 3000
app.listen(port, () => winston.info(`Listening to port ${port}..`))


