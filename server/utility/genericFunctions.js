(function () {
    'use strict'
    const jwt = require('jsonwebtoken');
    const crypto = require('crypto');
    const constants = require('./constants');
    const jsonResponse = require('../utility/jsonResponse');

    var generics = () => {

        return {
            errorFunc: function (data) {
                return {
                    "message": data
                };
            },

            checkEmptyNull: function (object, data, errfun) {
                if (data === undefined || data === "") {
                    var message;
                    message = this.errorFunc(object + " is missing");
                    errfun(message);
                    return true
                }
                return false
            },

            checkPasswordRequired: function (object, data, authProvider,errfun) {
              if (authProvider === 'traditional' && (data === undefined || data === "")) {
                  var message;
                  message = this.errorFunc(object + " is missing");
                  errfun(message);
                  return true
              }
              return false
          },


            generateTokenLink: function (data) {
                var token = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME
                });
                return token
            },

            inputparams: function (paramName, dataType, value) {
                return {
                    "node": paramName,
                    "dataType": dataType,
                    "value": value
                }
            },

            encrypt: function (pwd) {
                return (crypto.createHash('sha256').update(pwd).digest('base64'));
            },


            findDuplicates : async (data) => {
                const output = {};
                data.forEach((obj) => {
                  const key = obj.challenge_id;
                  if (!output[key]) {
                    output[key] = [];
                  }
                  const convertedObj =
                    obj.constructor.name === "RowDataPacket" ? { ...obj } : obj;
                  output[key].push(convertedObj);
                });
              
                const resultArrays = Object.values(output).map((arr, id) => ({
                  id,
                  inner: arr,
                }));
              
                return resultArrays.reverse();
              },

               includeCommentCount : (nestedArray, array2) =>{
                return nestedArray.map(outerObj => ({
                  ...outerObj,
                  inner: outerObj.inner.map(innerObj => {
                    const matchingObject = array2.find(obj =>  obj.id === outerObj.id && obj.inner.some(i => i.challenge_id === innerObj.challenge_id));
                    return matchingObject ? { ...innerObj, comment_count: matchingObject.inner.find(i => i.challenge_id === innerObj.challenge_id).comments_count } : innerObj;
                  }),
                }));
              }

        }
    };
    module.exports = generics();
})();