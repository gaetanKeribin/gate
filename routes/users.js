const router = require("express").Router();
const User = require("../models/user");

const { authenticate } = require("../middleware/authenticate");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const users = await User.find();

    console.log("Users fetched");
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
