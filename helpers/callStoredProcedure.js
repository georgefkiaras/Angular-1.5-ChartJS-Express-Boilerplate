var sql     = require('mssql')
var config  = require('../config/config')
var wrapAsync = require('../helpers/wrapAsync')

var configVars = {
    user: config.db_login.username,
    password: config.db_login.password,
    server: config.db_login.server,
    database: config.db_login.database    
}

var callStoredProcedure = (params = 0, proc) => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                //establish connection to database
                var pool = new sql.ConnectionPool(configVars)
                await pool.connect()

                //asynchronous function to call store procedure and retrieve results
                var data = await (() => {
                    return new Promise((resolve, reject) => {
                        let request = new sql.Request(pool)

                        /* 
                        *  if parameters are supplied, 
                        *  then assign each parameter with appropriate sql data type
                        */ 
                        if(params)
                            for(let param of params){ request.input(param.name, param.type, param.value) }
                
                        request.execute(proc, (err, results) => {
                            if(results != null && results.recordset != null){
                                resolve(results.recordset)
                            }
                            else{
                                console.log("No Results, error object: ",err)
                                resolve(null)
                            }
                            
                        })
                    })
                })()

                //close connection to database and return results
                await pool.close()
                resolve(data) 

            } catch (error) {
                console.log('Unable to connect to database: '+ error)
                resolve({ ConnectionError: 'Unable to fetch data'} )
            }
        })()
    })    
} 

module.exports = callStoredProcedure