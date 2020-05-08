const router = require("express").Router();
const { authenticate } = require("../middleware/authenticate");
const multer = require("multer");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { Readable } = require("stream");

router.post("/:bucketName", authenticate, async (req, res, next) => {
  try {
    const storage = multer.memoryStorage();
    const upload = multer({
      storage: storage,
      limits: { fieldSize: 2 * 1024 * 1024, files: 1 },
    });

    upload.single("file")(req, res, (err) => {
      const { name } = req.body;
      const { bucketName } = req.params;
      if (err) {
        // console.log("err", err);
        return res
          .status(400)
          .json({ message: "Upload Request Validation Failed" });
      } else if (!bucketName) {
        return res
          .status(400)
          .json({ message: "No bucketName name in request body" });
      }

      // Convert buffer to Readable Stream
      const readableTrackStream = new Readable();

      readableTrackStream.push(req.file.buffer);
      readableTrackStream.push(null);
      // console.log("readableTrackStream", readableTrackStream);

      let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName,
      });

      let uploadStream = bucket.openUploadStream(
        name || crypto.randomBytes(16),
        {
          chunkSizeBytes: null,
          metadata: { owner: req.user._id },
          contentType: null,
          aliases: null,
        }
      );

      let id = uploadStream.id;
      readableTrackStream.pipe(uploadStream);

      uploadStream.on("error", (err) => {
        next(err);
        return res.status(500).json({ message: "Error uploading file" });
      });
      uploadStream.on("finish", async () => {
        if (Array.isArray(req.user[bucketName])) {
          req.user[bucketName].push(id);
        } else {
          req.user[bucketName.slice(0, -1)] = id;
        }
        await req.user.save();

        res.status(201).send({ updatedUser: req.user });
      });
    });
  } catch (error) {
    next(err);
  }
});

router.get("/:bucketName/:fileId", async (req, res, next) => {
  const { bucketName } = req.params;
  try {
    var fileId = new mongoose.mongo.ObjectID(req.params.fileId);
  } catch (err) {
    return res.status(400).json({
      message:
        "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }

  let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName,
  });

  res.set("content-type", "image/jpeg");
  res.set("accept-ranges", "bytes");
  let downloadStream = bucket.openDownloadStream(fileId);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
});

router.delete("/:bucketName/:fileId", authenticate, async (req, res, next) => {
  const { bucketName } = req.params;
  try {
    var fileId = new mongoose.mongo.ObjectID(req.params.fileId);
  } catch (err) {
    return res.status(400).json({
      message:
        "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }

  try {
    let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName,
    });

    await bucket.delete(fileId);

    if (Array.isArray(req.user[bucketName])) {
      _.remove(req.user[bucketName], (file_id) => file_id === fileId);
    } else {
      req.user[bucketName.slice(0, -1)] = null;
    }
    await req.user.save();

    res.status(200).send({ updatedUser: req.user });
  } catch (error) {}
});

module.exports = router;
