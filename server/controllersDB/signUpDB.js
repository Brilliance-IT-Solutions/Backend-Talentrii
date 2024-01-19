const sqlConnect = require('../database/connection');
const genericFunc = require('../utility/genericFunctions');
const jsonResponse = require('../utility/jsonResponse')
const { dataTypeEnum, procedureEnum, errorEnum } = require('../database/databaseEnums');

const signUpDB = () => {
    return {
        signUpDB: async (req, res, next) => {
            const successFn = (result) => {
                jsonResponse.successHandler(res, next, result)
            }
            const errFn = (err) => {
                jsonResponse.errorHandler(res, next, err)
            }

            if (
                genericFunc.checkEmptyNull('firstName', req.body.firstName, errFn) == true ||
                genericFunc.checkEmptyNull('emailId', req.body.emailId, errFn) == true ||
                genericFunc.checkPasswordRequired('password',req.body.password, req.body.authProvider,errFn) == true ||
                genericFunc.checkEmptyNull('authProvider', req.body.authProvider, errFn) ==  true
                ) return


            const inputObject = [
                genericFunc.inputparams('firstName', dataTypeEnum.varChar, req.body.firstName),
                genericFunc.inputparams('emailId', dataTypeEnum.varChar, req.body.emailId),
                genericFunc.inputparams('passsword', dataTypeEnum.varChar, req.body.password ? genericFunc.encrypt(req.body.password):''),
                genericFunc.inputparams('authProvider', dataTypeEnum.varChar, req.body.authProvider)
            ]

            sqlConnect.connectDb(req, errFn, procedureEnum.proc_signUp, inputObject, errorEnum.proc_signUp, function (result) {
                let data = result[0][0]
                if (data.message === 'Sign Up Success') {
                    response = {
                        'message': data.message,
                        'token': genericFunc.generateTokenLink(data),
                        'data': data
                    }
                    successFn(response);
                } else {
                    response = {
                        'message': data.message
                    }
                    errFn(response);
                }
            })
        }
    }
}
module.exports = signUpDB();