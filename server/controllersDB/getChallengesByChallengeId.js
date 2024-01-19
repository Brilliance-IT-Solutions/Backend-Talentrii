const statusCode = require("http-status-codes");
const sqlConnect = require("../database/connection");
const genericFunc = require("../utility/genericFunctions");
const jsonResponse = require("../utility/jsonResponse");
const {
  dataTypeEnum,
  procedureEnum,
  errorEnum,
} = require("../database/databaseEnums");

const getChallengeByChallengeId = () => {
  return {
    getChallengeByChallengeId: async (req, res, next) => {
        console.log(req.body)
      const successFn = (result) => {
        jsonResponse.successHandler(res, next, result);
      };
      const errFn = (err, statusCode) => {
        jsonResponse.errorHandler(res, next, err, statusCode);
      };

      if (genericFunc.checkEmptyNull("userId", req.user.id, errFn) == true)
        return;

      const inputObject = [
        genericFunc.inputparams("userId", dataTypeEnum.varChar, req.user.id),
        genericFunc.inputparams("challengeId", dataTypeEnum.varChar, req.body.challengeId),
      ];

      sqlConnect.connectDb(
        req,
        errFn,
        procedureEnum.proc_getChallenges_By_Id,
        inputObject,
        errorEnum.proc_getChallenges_By_Id,
        async function (result) {
          if (result.length > 0) {
            if (result[0] && result[1]) {
              let data = result[0];
              let data1 = result[1];
              let data2 = result[2];
              let data3 = result[3];
              let data4 = result[4];


              if ((data[0]?.message === "Media Success") ||  (data1[0]?.message === "Comment Success" || (data2[0]?.message === "Success") ||  (data3[0]?.message === "User Detail Success") ||(data4[0]?.message === "Challenge Detail Success"))) {
                const newarray = await genericFunc.findDuplicates(result[0]);
                const newarray2 = await genericFunc.findDuplicates(result[1]);
                const comments = result[2];
                const userDetail = result[3];
                const challlengeDetail = result[4];

              // Call the function
              const updatedNestedArray = genericFunc.includeCommentCount(newarray, newarray2);
              // Output the updated nestedArray
              // Modify the first object in the first array directly
              updatedNestedArray[0].comments = comments;
              updatedNestedArray[0].userDetail = userDetail[0];
              updatedNestedArray[0].challlengeDetail = challlengeDetail[0]
                const response = {
                   message: data.message,
                   data: updatedNestedArray,
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

module.exports = getChallengeByChallengeId();
