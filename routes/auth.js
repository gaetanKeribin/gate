const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");
const User = require("../models/user");
const Job = require("../models/job");
const _ = require("lodash");

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken(req.ip);

    console.log("Logged in successfuly.");
    res.send({ user, token });
  } catch (e) {
    next(e);
  }
});

router.get("/token/verify", authenticate, async (req, res, next) => {
  res.status(200).send({ token: req.token });
});

router.post("/signup", async function (req, res, next) {
  console.log("authController signUp");

  const { email, password, firstname, lastname } = req.body;
  const user = new User({ email, password, firstname, lastname });

  try {
    await user.save();
    const token = await user.generateAuthToken(req.ip);

    res.status(201).send({ user, token });
  } catch (e) {
    next(e);
  }
});

router.get("/logout", authenticate, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    console.log("Token deleted");
    res.send();
  } catch (e) {
    next(e);
  }
});
router.delete("/", authenticate, async (req, res, next) => {
  console.log("usersController removeUser");

  try {
    req.user.jobs.forEach(async (job) => {
      await Job.findByIdAndDelete(job);
    });
    await User.findByIdAndDelete(req.user._id);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
});

router.patch("/", authenticate, async (req, res, next) => {
  const {
    description,
    jobTitle,
    organisation,
    promo,
    email,
    alumni,
    administration,
    professor,
  } = req.body;
  try {
    req.user.description = description;
    req.user.promo = promo;
    req.user.jobTitle = jobTitle;
    req.user.organisation = organisation;
    req.user.email = email;
    req.user.alumni = alumni;
    req.user.administration = administration;
    req.user.professor = professor;

    await req.user.save();
    console.log("User updated");
    res.status(200).send({ user: req.user });
  } catch (err) {
    next(err);
  }
});
router.patch("/password", authenticate, async (req, res, next) => {
  console.log("authController updatePassword");
  const { password, newPassword } = req.body;
  try {
    const user = await User.findByCredentials(req.user.email, password);
    if (!user) throw new Error("invalid credentials");
    user.password = newPassword;
    await user.save();
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
