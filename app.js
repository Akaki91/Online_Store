const express = require('express')
const app = express()
const nunjucks = require('nunjucks')

app.use(express.static('public'))

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('/login', (req, res) => {
    res.send('login')
})


app.listen(3000)