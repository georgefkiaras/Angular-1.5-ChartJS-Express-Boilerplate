var express = require('express')
var authenticate = require('../middlewares/authenticate')

var wrapAsync = require('../helpers/wrapAsync')
var router = express.Router()

router.use(authenticate)



router.get('/*', wrapAsync(async (req, res, next) => {
    var devEnv = false;

    if (process.env.NODE_ENV != null && process.env.NODE_ENV.trim() === "development") {
        devEnv = true;
    }
    res.render('index', {
        devEnv : devEnv
    })
}))

module.exports = router