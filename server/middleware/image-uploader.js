const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" || 
    file.mimetype === "video/mp4"
  ) {
    cb(null, true);
  } else {
    cb(
      {
        message:
          "Invalid file type, supported file types are jpg, png, jpeg, mp4",
        code: 201,
      },
      false
    );
  }
};

const storage = multer.memoryStorage();
const upload = multer({ fileFilter : fileFilter,storage: storage });

module.exports = upload;

