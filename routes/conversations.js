const router = require("express").Router();
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { authenticate } = require("../middleware/authenticate");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: new ObjectId(req.user._id),
    })
      .select("-messages")
      .populate("participants", "-password -tokens -sockets -jobs")
      .populate("lastMessage")
      .sort("-lastMessageSentAt");

    const convIdsWithPartsIds = conversations.map((conv) => {
      return {
        _id: conv._id,
        participants: conv.participants.map((participant) => {
          return participant._id;
        }),
      };
    });
    let convIds = new Set();
    conversations.map((conv) => {
      convIds.add(conv._id);
    });
    convIds = [...convIds];
    let interlocutorsIds = new Set();
    conversations.forEach((conv, i) => {
      _.remove(
        conversations[i].participants,
        (user) => `${user._id}` === `${req.user._id}`
      );
      conv.participants.forEach((participant) => {
        interlocutorsIds.add(participant._id);
      });
    });
    interlocutorsIds = [...interlocutorsIds];

    console.log("Conversations fetched");
    res
      .status(200)
      .send({ conversations, interlocutorsIds, convIds, convIdsWithPartsIds });
  } catch (err) {
    next(err);
  }
});

router.get("/single/:id", authenticate, async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("messages")
      .populate("participants", "-password -tokens -sockets -jobs")
      .populate("lastMessage");

    _.remove(
      conversation.participants,
      (user) => `${user._id}` === `${req.user._id}`
    );
    conversation.messages.reverse();
    console.log("Conversation fetched");
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    await Message.deleteMany({
      _id: { $in: conversation.messages },
    });
    await conversation.remove();
    console.log("Conversation deleted");
    res.status(200).send(req.params._id);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
