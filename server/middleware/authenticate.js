const jwt = require('jsonwebtoken');
const constants = require('../utility/constants')
const jsonResponse = require('../utility/jsonResponse');
const statusCode  = require('http-status-codes');

const authenticate = (req, res, next) => {

    const errFn = (err, statusCode) => {
        jsonResponse.errorHandler(res, next, err,statusCode);
      };

    try {
        // const token = req.headers.authorization.split('')[1]
        const token = req.headers.token
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.user = decode.data
        next()
        
    } catch (error) {
    if (error.name == "TokenExpiredError") {
       const response = {
                    message: constants.inValidToken 
                }
        errFn(response, statusCode.StatusCodes.UNAUTHORIZED)
    } else {
        const response = {
            message: constants.authenticationFailed
        }
        errFn(response, statusCode.StatusCodes.NON_AUTHORITATIVE_INFORMATION)

    }


    }
}

module.exports = authenticate