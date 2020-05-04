const Message = require("../models/message");
const User = require("../models/user");
const Conversation = require("../models/conversation");

exports.createNewConversation = async (data, sender, recipient) => {
  try {
    const conversation = new Conversation({
      participants: [sender, recipient],
    });

    const message = new Message(data);
    message.conversation_id = conversation._id;

    recipient.privateConversations.push({
      interlocutor_id: sender._id,
      conversation_id: conversation._id,
    });
    sender.privateConversations.push({
      interlocutor_id: recipient._id,
      conversation_id: conversation._id,
    });

    conversation.lastMessage = message;
    conversation.lastMessageSentAt = message.sentAt;
    conversation.messages = [message];

    await conversation.save();
    await message.save();
    await sender.save();
    await recipient.save();

    console.log(sender, recipient);

    return { conversation, message };
  } catch (error) {
    console.log(error);
  }
};

exports.saveMessageToConversation = async (data) => {
  try {
    const message = new Message(data);

    await Conversation.findByIdAndUpdate(data.conversation_id, {
      $push: {
        messages: message._id,
      },
      $set: {
        lastMessage: message,
        lastMessageSentAt: message.sentAt,
      },
    });

    await message.save();

    return message;
  } catch (error) {
    console.log(error);
  }
};
