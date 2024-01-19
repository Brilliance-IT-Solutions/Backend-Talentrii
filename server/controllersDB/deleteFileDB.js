const { dataTypeEnum, procedureEnum, errorEnum } = require('../database/databaseEnums');


const deleteFile = () =>{
    return {
     deleteFileDB : async(req,res,next)=>{
             const id = req.params.id
             sqlConnect.connectDb(req, errFn, procedureEnum.proc_delete_file, inputObject, errorEnum.proc_upload_media, function (result) {
               console.log(result)
            })

        }
    }
}

module.exports = deleteFile();