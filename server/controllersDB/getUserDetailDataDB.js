const statusCode = require("http-status-codes");
const sqlConnect = require("../database/connection");
const genericFunc = require("../utility/genericFunctions");
const jsonResponse = require("../utility/jsonResponse");
const {
  dataTypeEnum,
  procedureEnum,
  errorEnum,
} = require("../database/databaseEnums");

const getUserDetailDataDB = () => {
  return {
    getUserDetailDataDB: async (req, res, next) => {
        console.log(req.body)
      const successFn = (result) => {
        jsonResponse.successHandler(res, next, result);
      };
      const errFn = (err, statusCode) => {
        jsonResponse.errorHandler(res, next, err, statusCode);
      };

      if (genericFunc.checkEmptyNull("userId", req.body.userId, errFn) == true)
        return;

      const inputObject = [
        genericFunc.inputparams("userId", dataTypeEnum.varChar, req.body.userId),

      ];

      sqlConnect.connectDb(
        req,
        errFn,
        procedureEnum.proc_getuser_detail,
        inputObject,
        errorEnum.proc_getuser_detail,
        async function (result) {
          if (result.length > 0) {
            if (result[0] && result[1]) {
              let data = result[0];
              let data1 = result[1];
              let data2 = result[2];

              if ((data[0]?.message === "User Detail Success") || (data1[0]?.message === "User Challenges Success" &&  data2[0]?.message === "Comment Success")) {
                const newarray = await genericFunc.findDuplicates(result[1]);
             
                const newarray2 = await genericFunc.findDuplicates(result[2]);
                // Call the function
                const updatedNestedArray = genericFunc.includeCommentCount(newarray, newarray2);
                 const newResponses = {
                   ...data[0],
                  media : updatedNestedArray
                 }

               const response = {
                  message: data.message,
                  data: newResponses,
                };
                successFn(response);
              } else {
                response = {
                  message: data.message,
                };
                errFn(response, statusCode.StatusCodes.UNAUTHORIZED);
              }
            }
          }
        }
      );
    },
  };
};



module.exports = getUserDetailDataDB();
