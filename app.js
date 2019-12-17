const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const login = require('./routs/login')

app.use(express.static('public'))
app.use('/login', login)

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

//-------------------------------

app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('/profile', (req, res) => {
    console.log(req.user);
    
    res.send('This is a profile page')
})

app.listen(3000)


