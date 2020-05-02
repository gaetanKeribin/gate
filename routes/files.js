const router = require("express").Router();
const { authenticate } = require("../middleware/authenticate");
const path = require("path");
const fs = require("fs");

router.get("/:bucketName/:id", function(req, res, next) {
  console.log(
    "fetching file",
    req.params.id,
    "in",
    path.join(__dirname, `../public/${req.params.bucketName}/`)
  );

  const options = {
    root: path.join(__dirname, `../public/${req.params.bucketName}`),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  const fileName = req.params.id;
  res.sendFile(fileName, options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      const bucketNames = Object.keys(req.files);

      bucketNames.forEach(async bucketName => {
        // save file to bucket
        let file = req.files[bucketName];
        let temp = file.name.split(".");
        let ext = temp[temp.length - 1];
        let filename = `${req.user._id}.${ext}`;
        let dest = path.join(__dirname, `../public/${bucketName}/${filename}`);
        file.mv(dest);

        // save file info to user
        req.user[bucketName] = {
          mimetype: file.mimetype,
          ext,
          filename
        };
        await req.user.save();

        res.send({ user: req.user });
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:bucketName/:filename", authenticate, (req, res, next) => {
  console.log("attempting to delete file");
  try {
    let dest = path.join(
      __dirname,
      `../public/${req.params.bucketName}/${req.params.filename}`
    );
    fs.unlink(dest, async () => {
      console.log("file deleted");

      req.user.avatar = null;
      await req.user.save();
      res.status(200).send();
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const files = await gfs.files.find().toArray();
    return res.send(files);
  } catch (error) {}
});

module.exports = router;
