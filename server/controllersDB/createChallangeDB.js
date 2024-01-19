const statusCode = require("http-status-codes");
const sqlConnect = require("../database/connection");
const genericFunc = require("../utility/genericFunctions");
const jsonResponse = require("../utility/jsonResponse");
const {
  dataTypeEnum,
  procedureEnum,
  errorEnum,
} = require("../database/databaseEnums");
const schema = require("../schemas/createChallengeSchema");

const createChallangeDB = () => {
  return {
    createChallangeDB: async (req, res, next) => {
      const successFn = (result) => {
        jsonResponse.successHandler(res, next, result);
      };
      const errFn = (err, statusCode) => {
        jsonResponse.errorHandler(res, next, err, statusCode);
      };
      var reqB = JSON.stringify(req.body);
      var reqBody = JSON.parse(reqB);
      const { error } = schema.validate(reqBody);
      if (error) {
        var message =
          error?.details?.length && error.details[0].message
            ? error.details[0].message
            : "Missing Fields";
        const response = {
          message: message,
          // 'token': genericFunc.generateTokenLink(data),
        };
        errFn(response, statusCode.StatusCodes.NOT_ACCEPTABLE);
        return;
      } else {
        // if (genericFunc.checkEmptyNull('userId', req.user.id, errFn) == true ||
        //     genericFunc.checkEmptyNull('title', req.body.title, errFn) == true ||
        //     genericFunc.checkEmptyNull('description', req.body.description, errFn) == true ||
        //     genericFunc.checkEmptyNull('url', req.body.url, errFn) == true ||
        //     genericFunc.checkEmptyNull('latitude', req.body.latitude, errFn) == true ||
        //     genericFunc.checkEmptyNull('longitude', req.body.longitude, errFn) == true ||
        //     genericFunc.checkEmptyNull('fromDate', req.body.fromDate, errFn) == true ||
        //     genericFunc.checkEmptyNull('toDate', req.body.toDate, errFn) == true ||
        //     genericFunc.checkEmptyNull('time', req.body.time, errFn) == true) return

        const inputObject = [
          genericFunc.inputparams("userId", dataTypeEnum.varChar, req.user.id),
          genericFunc.inputparams(
            "title",
            dataTypeEnum.varChar,
            req.body.title
          ),
          genericFunc.inputparams(
            "description",
            dataTypeEnum.varChar,
            req.body.description
          ),
          // genericFunc.inputparams('url', dataTypeEnum.varChar, req.body.url),
          genericFunc.inputparams(
            "latitude",
            dataTypeEnum.varChar,
            req.body.latitude
          ),
          genericFunc.inputparams(
            "longitude",
            dataTypeEnum.varChar,
            req.body.longitude
          ),
          genericFunc.inputparams(
            "startDate",
            dataTypeEnum.date,
            req.body.startDate
          ),
          genericFunc.inputparams(
            "endDate",
            dataTypeEnum.date,
            req.body.endDate
          ),
          genericFunc.inputparams(
            "startTime",
            dataTypeEnum.time,
            req.body.startTime
          ),
          genericFunc.inputparams(
            "category",
            dataTypeEnum.varChar,
            req.body.category
          ),
          genericFunc.inputparams(
            "endTime",
            dataTypeEnum.time,
            req.body.endTime
          ),
          genericFunc.inputparams(
            "location",
            dataTypeEnum.varChar,
            req.body.location
          ),
          genericFunc.inputparams(
            "privacy",
            dataTypeEnum.varChar,
            req.body.privacy
          ),
        ];
        console.log(inputObject)
        sqlConnect.connectDb(
          req,
          errFn,
          procedureEnum.proc_create_challange,
          inputObject,
          errorEnum.proc_create_challange,
          function (result) {
            if (result.length > 0) {
              if (result[0]) {
                let data = result[0];
                if (data[0].message === "Challange Created") {
                  let challengeId = result[1][0].challenge;
                  let media = req.body.url;
                  if (media.length > 0) {
                    media.forEach((element) => {
                      const inputObject2 = [
                        genericFunc.inputparams(
                          "userId",
                          dataTypeEnum.varChar,
                          req.user.id
                        ),
                        genericFunc.inputparams(
                          "thumbnail_url",
                          dataTypeEnum.varChar,
                          element.thumbnailurl
                        ),
                        genericFunc.inputparams(
                          "challenge_id",
                          dataTypeEnum.varChar,
                          challengeId
                        ),
                        genericFunc.inputparams(
                          "original_url",
                          dataTypeEnum.varChar,
                          element.originalurl
                        ),
                        genericFunc.inputparams(
                          "type",
                          dataTypeEnum.varChar,
                          element.type
                        ),
                      ];

                      sqlConnect.connectDb(
                        req,
                        errFn,
                        procedureEnum.proc_upload_media,
                        inputObject2,
                        errorEnum.proc_upload_media,
                        function (result) {
                          if (result.length > 0) {
                            if (result[0]) {
                              let data = result[0];
                              if (data[0].message === "Media uploaded") {
                                response = {
                                  message: data[0].message,
                                  // 'token': genericFunc.generateTokenLink(data),
                                };
                              } else {
                                response = {
                                  message: data[0].message,
                                };
                                errFn(
                                  response,
                                  statusCode.StatusCodes.UNSUPPORTED_MEDIA_TYPE
                                );
                              }
                            }
                          }
                        }
                      );
                    });
                  }

                  response = {
                    message: data[0].message,
                    "data" :  data[data.length - 1]
                  };
                  successFn(response);
                }
              }
            }
          }
        );
      }
    },
  };
};
module.exports = createChallangeDB();
