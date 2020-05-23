const Message = require("../models/message");
const User = require("../models/user");
const Conversation = require("../models/conversation");

exports.createNewConversation = async (data, sender) => {
  try {
    const recipient = await User.findById(data.recipient);

    const conversation = new Conversation({
      participants: [sender, recipient],
      messages: [data],
      lastMessageSentAt: data.sentAt,
    });

    recipient.conversations.push({
      interlocutor_id: sender._id,
      conversation_id: conversation._id,
    });
    sender.conversations.push({
      interlocutor_id: recipient._id,
      conversation_id: conversation._id,
    });

    await conversation.save();
    await sender.save();
    await recipient.save();

    return conversation;
  } catch (error) {
    console.log(error);
  }
};

exports.saveMessageToConversation = async (data) => {
  try {
    await Conversation.findByIdAndUpdate(data.conversation_id, {
      $push: { messages: data },
      $set: { lastMessageSentAt: data.sentAt },
    });

    return conversation;
  } catch (error) {
    console.log(error);
  }
};
