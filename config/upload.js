const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");

const storage = new GridFsStorage({
  db: mongoose.connection,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    console.log("upload storage engine", file);

    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: req.params.bucketName,
          owner: req.user._id
        };
        req.user.profilePicture = filename;
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage: storage });
// var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = { upload };
