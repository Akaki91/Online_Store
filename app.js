const winston = require('winston')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const login = require('./routes/login')
const products = require('./routes/products')
const { register, Account } = require('./routes/register')
const config = require('config')
const auth = require('./middleware/login')
const error = require('./middleware/error')
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
app.use('/login', login)
app.use('/products', products)
app.use('/register', register) 
app.use(bodyParser.urlencoded({ extended: false }))

app.use(error)

let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
})

//-------------------------------

app.use((req, res, next) => {
    const token = req.cookies.jwt;
    let isAuthorized = false;
    if (token) {
        isAuthorized = jwt.verify(token, config.get('jwtPrivateKey'));
    }
    env.addGlobal('isAuthorized', isAuthorized);
    next();
});

app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('/profile', auth, async (req, res) => {

    // let sortBy = req.query.sort_by;
    
    const user = await Account.findById(req.user._id).select('-password')

    // if (sortBy) {
    //     Account.sort({price: 'desc'});
    // }
    
    res.render('profiledet.html', { user })
})

app.get('/profile/orders', auth, (req, res) => {

    res.render('profileord.html')
})

app.get('/profile/logout', (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/')
})

app.get('/collection', (req, res) => {
    res.render('collection.html')
})

app.get('/home', (req, res) => {
    res.render('home.html')
})


const port = process.env.PORT || 3000
app.listen(port, () => winston.info(`Listening to port ${port}..`))


