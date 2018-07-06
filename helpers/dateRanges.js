var cache = require('memory-cache')
var vars = require('../variables')
var callStoredProcedure = require('./callStoredProcedure')

var dateRanges = {
    get: async () => {
        let day = 86400
        let cached = cache.get('dateRanges')

        if (cached) {
            return cached;
        }
        else {
            let proc = vars.storedProc.getDateRanges
            let dateRanges = await callStoredProcedure(null, proc)
            cache.put('dateRanges', dateRanges, day)
            return dateRanges;
        }
    }
}
module.exports = dateRanges