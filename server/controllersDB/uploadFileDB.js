const sqlConnect = require('../database/connection');
const genericFunc = require('../utility/genericFunctions');
const jsonResponse = require('../utility/jsonResponse')
const { dataTypeEnum, procedureEnum, errorEnum } = require('../database/databaseEnums');
const constants = require('../utility/constants')

const uploadFileDB = () => {
    return {
        uploadFileDB: async (req, res, next) => {
            let filelocation=[] , mimetype=[],size=[],originalname=[]
           req.files.forEach((file)=>{
            filelocation.push(file.location)
           mimetype.push(file.mimetype)
           size.push(file.size)
           originalname.push(file.originalname)
           })
            const successFn = (result) => {
                jsonResponse.successHandler(res, next, result)
            }
            const errFn = (err) => {
                jsonResponse.errorHandler(res, next, err)
            }

            // if (genericFunc.checkEmptyNull('userId', req.user.id, errFn) == true) return
            const inputObject = [
                genericFunc.inputparams('userId', dataTypeEnum.varChar, 1),
                genericFunc.inputparams('file_path','varChar', filelocation),
                genericFunc.inputparams('mime_type','varChar', mimetype),
                genericFunc.inputparams('size','varChar', size),
                genericFunc.inputparams('originalname','varChar', originalname)


            ]

            sqlConnect.connectDb(req, errFn, procedureEnum.proc_upload_media, inputObject, errorEnum.proc_upload_media, function (result) {
                if (result.length > 0) {
                    if (result[0][0]) {
                        let data = result[0][0]
                        if (data.message === 'Success') {
                            response = {
                                'message': data.message,
                                "fileName": 
                                // constants.awsBucketLocationProfile + req.file.key
                                 req.files.map((file)=> file.location)
                                
                            }
                            successFn(response);
                        } else {
                            response = {
                                'message': data.message
                            }
                            errFn(response);
                        }
                    }
                }
            })
        }
    }
}
module.exports = uploadFileDB();