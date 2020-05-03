const router = require("express").Router();
const { authenticate } = require("../middleware/authenticate");
const Job = require("../models/job");
const dataValidation = require("../middleware/dataValidation");
const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

// Fetch all available jobs
router.get("/", authenticate, async (req, res, next) => {
  console.log("jobsController fetchAllJobs");

  try {
    const jobs = await Job.find({}).populate(
      "publisher",
      "-password -tokens -sockets -jobs"
    );

    res.status(200).send({ jobs: jobs.reverse() });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    await req.user.populate("jobs").execPopulate();
    req.user.jobs = req.user.jobs.reverse();

    console.log("User's jobs fetched");
    res.status(200).send({ user: req.user });
  } catch (err) {
    next(err);
  }
});

// Post a new job offer in db
router.post("/", authenticate, async (req, res, next) => {
  // Security - picks only relevant fields
  const job = new Job(req.body);

  // Quality - check for missing field
  {
    if (!job.jobTitle) {
      next({ code: 400, message: "jobTitle is missing" });
    } else if (!job.jobDesc) {
      next({ code: 400, message: "jobDesc is missing" });
    } else if (!job.city) {
      next({ code: 400, message: "city is missing" });
    } else if (!job.organisation) {
      next({ code: 400, message: "organisation is missing" });
    } else if (!job.employmentType) {
      next({ code: 400, message: "employmentType is missing" });
    } else if (!job.contact) {
      next({ code: 400, message: "contact is missing" });
    }
  }

  job.publisher = req.user._id;

  try {
    // Security - check for callable function in new job
    dataValidation.objectDoesNotContainFunctions(job);

    await job.save();

    req.user.jobs = [...req.user.jobs, job._id];
    await req.user.save();
    console.log("Job posted");
    res.status(200).send({ job });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    await Job.findOneAndDelete({
      _id: new ObjectId(req.params.id),
      publisher: new ObjectId(req.user._id),
    });

    _.remove(req.user.jobs, (item) => item._id === req.params.id);
    await req.user.save();

    console.log("Job deleted");
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", authenticate, async (req, res, next) => {
  const {
    jobTitle,
    jobDesc,
    city,
    organisation,
    employmentType,
    asap,
    salary,
    minExp,
    contact,
  } = req.body;
  // Security - picks only relevant fields

  try {
    const job = await Job.findOne({
      _id: req.body._id,
      publisher: req.user._id,
    });

    if (jobTitle) job.jobTitle = jobTitle;
    if (jobDesc) job.jobDesc = jobDesc;
    if (city) job.city = city;
    if (organisation) job.organisation = organisation;
    if (employmentType) job.employmentType = employmentType;
    if (asap) job.asap = asap;
    if (salary) job.salary = salary;
    if (minExp) job.minExp = minExp;
    if (contact) job.contact = contact;

    await job.save();
    await req.user.populate("jobs").execPopulate();
    console.log("Job updated");
    res.status(200).send({ jobs: req.user.jobs });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
