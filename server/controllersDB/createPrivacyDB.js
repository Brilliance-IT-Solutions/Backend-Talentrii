const sqlConnect = require('../database/connection');
const genericFunc = require('../utility/genericFunctions');
const jsonResponse = require('../utility/jsonResponse')
const { dataTypeEnum, procedureEnum, errorEnum } = require('../database/databaseEnums');
const statusCode = require("http-status-codes")

const privacyDB = () => {
    return {
        privacyDB: async (req, res, next) => {
            const successFn = (result) => {
                jsonResponse.successHandler(res, next, result)
            }
            const errFn = (err,statusCode) => {
                jsonResponse.errorHandler(res, next, err,statusCode)
            }

            const inputObject = [
                genericFunc.inputparams("userId", dataTypeEnum.varChar, req.user.id),
                genericFunc.inputparams("privacy", dataTypeEnum.varChar, req.body.privacy),
               
            ]

            sqlConnect.connectDb(req, errFn, procedureEnum.proc_create_challenge_privacy, inputObject, errorEnum.proc_create_challenge_privacy, function (result) {
                if (result.length > 0) {
                    if (result[0][0]) {
                        let data = result[0][0]
                        if (data.message === 'challenge_privacy updated') {
                            response = {
                                'message': data.message,
                                'data': data
                            }
                            successFn(response);
                        } else {
                            response = {
                                'message': data.message
                            }
                            errFn(response,statusCode.StatusCodes.BAD_REQUEST);
                        }
                    }
                }
            })
        }
    }
}
module.exports = privacyDB();