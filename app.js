const mongoose = require('mongoose')
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const login = require('./routes/login')
const products = require('./routes/products')
const { register } = require('./routes/register')



mongoose.connect('mongodb://localhost/storeitems', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect MongoDB..'))


app.use(express.static('public'))
app.use('/login', login)
app.use('/products', products)
app.use('/register', register)
app.use(bodyParser.urlencoded({ extended: false }))

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

//-------------------------------

app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('/profile', (req, res) => {

    if (req.session.logged_in != 1) {
        res.redirect('/login')
        return
    }
    
    res.send('This is a profile page')
})




app.listen(3000)


