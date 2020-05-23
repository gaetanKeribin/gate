const router = require("express").Router();
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { authenticate } = require("../middleware/authenticate");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      { _id: req.user.conversations },
      { messages: { $slice: 1 } }
    ).sort("-lastMessageSentAt");
    console.log("conversations", conversations);

    console.log("Conversations fetched");
    res.status(200).send({ conversations });
  } catch (err) {
    next(err);
  }
});

router.get("/single/:id", authenticate, async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id, {
      message: { $slice: [0, 50] },
    }).populate("participants", "-password -tokens -sockets -jobs");

    conversation.messages.reverse();
    console.log("Conversation fetched");
    res.status(200).send({ conversation });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
