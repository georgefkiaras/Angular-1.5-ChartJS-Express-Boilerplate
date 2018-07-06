var express = require('express')
var router  = express.Router()

var wrapAsync = require('../helpers/wrapAsync')

router.post('/data', wrapAsync(async(req, res, next) => {
    var chartData = [];
    for(var i = -10; i <= 10; i++){
        var values = {};
        values.xValue = i;
        values.cos = Math.cos(i);
        values.sin = Math.sin(i);
        values.tan = Math.tan(i);
        chartData.push(values);
    }
    res.status(200).send(chartData)

        
}))

module.exports = router
