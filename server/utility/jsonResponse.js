// (function () {
//     'use strict';

     var responseBack = {

       successHandler: (res, next, response) => {
            
           res.status(200).send({
               "status": 1,
               "response": response
           });
           res.end();          
        },
        errorHandler: (res, next, response,statusCode=400) => {
            res.status(statusCode).send({
                "status": 0,
                "response": response,
                
            });
            res.end();   
        }        
    };
    module.exports = responseBack;
// })(); 
