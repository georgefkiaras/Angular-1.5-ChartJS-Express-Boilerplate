var winston      = require('../config/winston')

var errorHandler = (error, req, res, next) => {
    res.locals.message = error.message
    res.locals.error = req.app.get('env') === 'development' ? error : {}

    winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

    res.status(error.status || 500).send(`${error.status || 500} Error occurred`)
}

module.exports = errorHandler
