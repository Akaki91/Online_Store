const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const login = require('./routs/login')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

app.use(express.static('public'))
app.use('/login', login)

// app.use(session ({
//     store: new FileStore({
//         encoder: JSON.stringify
//     }),
//     secret: 'KOEAKDOE'
// }))

// app.use(passport.initialize());
// app.use(passport.session())

// passport.serializeUser(function (user, done) {
//     done(null, user)
// })

// passport.deserializeUser(function (user, done) {
//     done(null, JSON.parse(user))
// })

// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         if (username != 'akaki ') {
//             return done(null, false, { message: 'Incorrect username' })
//         }
//         if (password != '1234') {
//             return done(null, false, { message: 'Incorrect password' })
//         }

//         return done(null, {
//             username: 'akaki',
//             name: 'Jemal',
//             email: 'jemal@yahoo.com'
//         })
//     }
// ));

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


