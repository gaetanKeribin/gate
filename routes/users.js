const router = require("express").Router();
const User = require("../models/user");

const { authenticate } = require("../middleware/authenticate");

router.get("/", authenticate, async (req, res, next) => {
  console.log("usersController fetchUsers");

  try {
    const users = await User.find();

    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
