const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// middlewares for express
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

app.use(bodyParser.json())
app.use(cors({
  methods:['GET','POST'],
  credentials: true // enable set cookie
}))
const store = new MongoDBStore({
  uri: 'mongodb+srv://pvpasm:jxJJAySr7Jt8d8X7@pvpasm-rxxxy.mongodb.net/pvpasm?retryWrites=true',
  collection: 'sessions'
})
app.use(session({
  secret: 'pvpasmabcdefghijklmnopqrstuvwxyz',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}))

// routes
const newsRoute = require('./api/news')
const userRoute = require('./api/user')
const leaderboardRoute = require('./api/leaderboard')
const challengeRoute = require('./api/challenge')
app.use('/api/news', newsRoute)
app.use('/api/user', userRoute)
app.use('/api/leaderboard', leaderboardRoute)
app.use('/api/challenge', challengeRoute)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
