var cache = require('memory-cache')
var vars = require('../variables')
var callStoredProcedure = require('./callStoredProcedure')

var defaultDates = {
    get: async () => {
        let day = 86400
        let cached = cache.get('dates')
        if (cached) {
            return cached
        }
        else {
            let proc = vars.storedProc.getDates
            let dates = await callStoredProcedure(null, proc)
            cache.put('dates', dates, day)
            return dates
        }
    }
}
module.exports = defaultDates