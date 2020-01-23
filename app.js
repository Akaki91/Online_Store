const winston = require('winston')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const login = require('./routes/login')
const { additem, Item } = require('./models/item')
const profile = require('./routes/profile')
const { register } = require('./models/register')
const adminroute = require('./routes/admin')
const cart = require('./routes/cart')
const config = require('config')
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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: { maxAge: 180 * 60 * 1000}
}))

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

app.use((req, res, next) => {
    res.locals.session = req.session,
    next()
})

app.use('/login', login)
app.use('/register', register) 
app.use('/additem', additem)
app.use('/profile', profile)
app.use('/admin', adminroute)
app.use('/cart', cart)
app.use(error)

//----------------------------------------------------------------------

app.get('/', (req, res) => {
    res.render('index.html')
})


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


