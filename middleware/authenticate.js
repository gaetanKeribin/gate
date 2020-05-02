const jwt = require("jsonwebtoken");
const User = require("../models/user");

const matchTokenWithUser = async (token) => {
  console.log("matchTokenWithUser");
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
  const user = await User.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });
  if (!user) {
    throw new Error("Token non reconnu");
  }
  return user;
};

const authenticate = async (req, res, next) => {
  console.log("middleware authenticate");

  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      res.status(403).send({
        forceReconnect: true,
        message: "Token non reconnu, déconnexion imminente.",
      });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate, matchTokenWithUser };
