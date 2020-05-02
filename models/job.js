const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jobSchema = new mongoose.Schema({
  employmentType: {
    type: String,
    required: true,
    trim: true
  },
  asap: {
    type: Boolean,
    required: true,
    default: false
  },
  organisation: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  jobDesc: {
    type: String,
    required: true
  },
  minExp: {
    type: String || Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("minExp must be a postive number");
      }
    }
  },
  contact: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    default: "contact@gmail.com",
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
});

jobSchema.methods.toJSON = function() {
  const job = this;
  const jobObject = job.toObject();

  //   delete userObject.password;
  //   delete userObject.tokens;

  return jobObject;
};

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
