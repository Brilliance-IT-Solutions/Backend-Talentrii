var sqlDb = () => {
    'use strict';

    var mysql = require('mysql');
    const constants = require('../utility/constants')
    const config = require('./configuration');

    return {
        connectDb: async (req, errFn, procName, inputObject, errorTitle, responseBack) => {
            const func = require('../utility/genericFunctions');

            var connection = mysql.createConnection(config);
            connection.connect(function (err) {
                if (err) throw errroFunc(err);
                // if (err) {
                //     errroFunc(err);
                //     return;
                // }
                let params = "",
                    counter = 0;
                inputObject.forEach(async element => {
                    if (typeof element.value === 'string') {
                        let d = JSON.stringify(element.value)
                        let search = d.replace(/(^"|"$)/g, '');
                        element.value = search
                    }
                    (counter == 0) ? params = '"' + element.value + '"' : params = params + ' , ' + '"' + element.value + '"'
                    counter += 1
                })

                console.log("CALL " + procName + "(" + params + ")")

                connection.query(`${"CALL " + procName + "(" + params + ")"}`, (err, result) => {
                   if (err) throw errroFunc(err);
                    // if (err) {
                    //     errroFunc(err);
                    //     return;
                    // }
                    responseBack(result)
                    connection.end();

                });
            })
            function errroFunc(err) {
                var message = func.errorFunc(err.message || "Err");
                errFn(message);
                connection.end();
            }
        }
    }
}
module.exports = sqlDb();