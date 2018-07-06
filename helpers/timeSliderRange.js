var sql = require('mssql')

var timeSliderRange = (start_month, start_year, end_month, end_year) => {
    /*
    * returning supplied parameters with assigned 
    * sql data types and stored procedure parameter names
    */ 
    return [                
        {
            name: 'STARTMONTH',
            value: start_month,
            type: sql.NVarChar(2)
        },
        {
            name: 'STARTYEAR',
            value: start_year,
            type: sql.NVarChar(4)
        },
        {
            name: 'ENDMONTH',
            value: end_month,
            type: sql.NVarChar(2)
        },
        {
            name: 'ENDYEAR',
            value: end_year,
            type: sql.NVarChar(4)
        }
    ]        
}

module.exports = timeSliderRange