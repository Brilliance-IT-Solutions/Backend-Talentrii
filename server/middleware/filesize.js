const jsonResponse = require("../../server/utility/jsonResponse");
const statusCode = require("http-status-codes")

const checkFileSizeBasedOnType =  (req, res, next) => {
    const files = req.files;
    const successFn = (result) => {
      jsonResponse.successHandler(res, next, result);
    };
    const errFn = (err, statusCode) => {
      jsonResponse.errorHandler(res, next, err,statusCode);
    };
  
    if (!files || !Array.isArray(files)) {
      response = {
        message:  `'No files uploaded or file upload failed' `
      };
      errFn(response,statusCode.StatusCodes.UNSUPPORTED_MEDIA_TYPE)
      return 
    }
  
    const fileSizeLimits = {
      'image/jpeg': 1024 * 1024 * 2,
      'image/jpg': 1024 * 1024 * 2,  
      'image/png': 1024 * 1024 * 2,  
      'video/mp4': 1024 * 1024 * 10,  
    };

    const maxTotalCount = 7;
    const maxImageCount = 5;
    const maxVideoCount = 2;
  
    const fileTypeCounts = { 'image': 0, 'video': 0 };
  
    for (const file of files) {
      const fileType = file.mimetype;
      const fileSizeLimit = fileSizeLimits[fileType];
      if (file.mimetype.startsWith('image/') && fileTypeCounts['image'] < maxImageCount) {
        fileTypeCounts['image']++;
      } else if (file.mimetype.startsWith('video/') && fileTypeCounts['video'] < maxVideoCount) {
        fileTypeCounts['video']++;

      } else {
        response = {
          message: 'File count exceeds allowed limits is 5 images and 2 videos'
        };
        errFn(response,statusCode.StatusCodes.UNSUPPORTED_MEDIA_TYPE)

        return 
      }
      if (fileSizeLimit && file.size > fileSizeLimit) {
        response = {
          message:  `File size exceeds the ${fileSizeLimit / (1024 * 1024)}MB limit for ${fileType}`
        };
        errFn(response,statusCode.StatusCodes.UNSUPPORTED_MEDIA_TYPE)

        return 
      }

      if (fileTypeCounts['image'] + fileTypeCounts['video'] > maxTotalCount) {
        response = {
          message:  `Total file count exceeds allowed limit is ${maxTotalCount}`
        };
        errFn(response,statusCode.StatusCodes.UNSUPPORTED_MEDIA_TYPE)
        return 
      }
    }
    // All files passed size checks, proceed to store in S3
    next();
  };


  module.exports = checkFileSizeBasedOnType
  