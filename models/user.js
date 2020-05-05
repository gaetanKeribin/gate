const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  professor: Boolean,
  student: Boolean,
  alumni: Boolean,
  administration: Boolean,
  avatar: {
    type: Object,
  },
  promo: {
    type: Number,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  organisation: {
    type: String,
    trim: true,
  },
  jobTitle: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  tokens: [
    {
      ip: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  sockets: [
    {
      socketId: {
        type: String,
        required: true,
      },
      ip: {
        type: String,
      },
    },
  ],
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  privateConversations: [
    {
      conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations",
      },
      interlocutor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function (ip) {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET || "secret"
  );

  console.log("token generated");
  _.remove(user.tokens, (item) => item.ip === ip);

  user.tokens = user.tokens.concat({ token, ip });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Cet email ne correspond à aucun compte.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Mot de passe incorrect.");
  }
  return user;
};

userSchema.statics.findSocketsFromUserIds = async function (data) {
  try {
    if (typeof data === "Array") {
      const sockets = [];
      const users = await User.find({ _id: { $in: data } }).select(
        "sockets -_id"
      );
      users.forEach((user) => {
        user.sockets.forEach((socket) => {
          sockets.push(socket.socketId);
        });
      });
      return sockets;
    } else if (typeof data === "String") {
      const sockets = await User.findById(data).select("sockets -_id").sockets;
      return sockets;
    }
  } catch (err) {
    console.log(err);
  }
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
