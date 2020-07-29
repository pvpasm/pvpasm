const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const db = require('./db/db')

const app = express()
const http = require('http').createServer(app);
require('socket.io')(http);

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const store = new MongoDBStore({
    uri: db.serverUrl,
    collection: 'sessions'
});
app.use(session({
    secret: 'pvpasmabcdefghijklmnopqrstuvwxyz',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: false,
    saveUninitialized: false
}))

const userRoute = require('./routes/user')
const learnRoute = require('./routes/learn')
const validateRoute = require('./routes/validate')
app.use('/user', userRoute)
app.use('/learn', learnRoute)
app.use('/validate', validateRoute)

if (require.main === module) {
    const port = process.env.PORT || 5000
    app.listen(port, () => {
        console.log(`API server listening on port ${port}`)
    })
}

module.exports = app