const ApiVideoClient = require("@api.video/nodejs-client");
const fs = require("fs");
const constants = require("../utility/constants");
const jsonResponse = require("../../server/utility/jsonResponse");
const statusCode = require("http-status-codes");
const sharp = require("sharp");
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: constants.S3_IAM_USER_SECRET,
  accessKeyId: constants.S3_IAM_USER_KEY,
  Bucket: constants.S3_BUCKET_NAME,
  correctClockSkew: true,
});
const s3 = new aws.S3();

const uploadVideo = async (req, res, next) => {
  const processedFiles = [];
  const successFn = (result) => {
    jsonResponse.successHandler(res, next, result);
  };
  const errFn = (err, statusCode) => {
    jsonResponse.errorHandler(res, next, err, statusCode);
  };
  try {
    const files = req.files;
    if (!files) {
      console.log("Error during file uploading");
    } else {
      for (const file of files) {
        if (file.mimetype.startsWith("image")) {
          await new Promise(async (resolve, reject) => {
            const [thumbnail, compressedImage] = await processImage(
              file.buffer
            );
            // Upload thumbnail to AWS S3
            const thumbnailKey = `images/thumbnails/${file.originalname}`;
            const thumbnailImage = await uploadToS3(
              thumbnailKey,
              thumbnail,
              file.mimetype
            );

            // Upload compressed image to AWS S3
            const compressedImageKey = `images/compressed/${file.originalname}`;
            const compressedImageFile = await uploadToS3(
              compressedImageKey,
              compressedImage,
              file.mimetype
            );

            const obj = {
              thumbnailurl: thumbnailImage.Location,
              originalurl: compressedImageFile.Location,
              type: file.mimetype,
            };

            processedFiles.push(obj);
            resolve({ thumbnailImage, compressedImageFile });
          });
        } else {
          const client = new ApiVideoClient({
            apiKey: "Ta7oycL3SCj1qJZEZF9B60uuO3M6NFP676J496wNPfV",
          });
          await new Promise(async (resolve, reject) => {
            const videoCreationPayload = {
              title: file.originalname, // The title of your new video.
              description: file.size.toString(), // A brief description of your video.
            };
            const video = await client.videos.create(videoCreationPayload);
            const tempFileName = "uploads/temp.mp4";
            await fs.writeFileSync(tempFileName, file.buffer);

            const videoUploadResponse = await client.videos.upload(
              video.videoId,
              tempFileName
            );

            const obj = {
              thumbnailurl: videoUploadResponse.assets.thumbnail,
              originalurl: videoUploadResponse.assets.mp4,
              type: file.mimetype,
            };

            processedFiles.push(obj);
            if (fs.existsSync(tempFileName)) {
              fs.unlinkSync(tempFileName);
            }
            resolve(videoUploadResponse);
          });
        }
      }
      response = {
        message: "Media Uploaded!",
        urls: processedFiles,
      };
      console.log(response);
      successFn(response);
    }
  } catch (error) {
    response = {
      message: error,
    };
    errFn(response, statusCode.StatusCodes.UNSUPPORTED_MEDIA_TYPE);
  }
};

async function processImage(imageBuffer) {
  const thumbnail = await sharp(imageBuffer).resize(100, 100).toBuffer();

  const compressedImage = await sharp(imageBuffer)
    .jpeg({ progressive: true, force: false, quality: 80 })
    .png({ progressive: true, force: false, quality: 80 })
    .toBuffer();

  return [thumbnail, compressedImage];
}

async function uploadToS3(key, file, mimetype) {
  let uploadedData;
  const params = {
    Bucket: constants.S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: mimetype,
  };

  await new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading thumbnail to S3:", err);
      } else {
        console.log("Thumbnail uploaded to S3:", data);
        uploadedData = data;
        resolve(data);
      }
    });
  });
  return uploadedData;
}

module.exports = {
  uploadVideo
};
