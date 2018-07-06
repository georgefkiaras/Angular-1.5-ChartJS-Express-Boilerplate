/**
 * Module dependencies
 */
var express      = require('express')
var helmet       = require('helmet')
var compression  = require('compression')
var morgan       = require('morgan')
var path         = require('path')

var winston      = require('./config/winston')
var indexRouter  = require('./routes/index')
var chartsRouter = require('./routes/charts')

var errorHandler = require('./middlewares/errorHandler')

var app = express()

/**
 * Go to http://appUrl/status for realtime server metrics for Express-based node servers
 */
app.use(require('express-status-monitor')())

/**
 * Secure express app with HTTP headers
 */
app.use(helmet())

/**
 * Reduce response body size through compression
 */
app.use(compression())


app.use(morgan('combined', { stream: winston.stream }))

/**
 * Setup view engine
 */

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/**
 * Parse HTTP request body
 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * Setup path to public folder
 */
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Routes setup
 */
app.use('/', indexRouter)
app.use('/api', chartsRouter)

app.use(errorHandler)

module.exports = app