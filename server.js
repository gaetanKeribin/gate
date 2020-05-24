const express = require("express");
const usersRouter = require("./routes/users");
const jobsRouter = require("./routes/jobs");
const filesRouter = require("./routes/files");
const authRouter = require("./routes/auth");
const conversationsRouter = require("./routes/conversations");
const Conversation = require("./models/conversation");
const { matchTokenWithUser } = require("./middleware/authenticate");
const {
  saveMessageToConversation,
  createNewConversation,
} = require("./controllers/messagesController");
const {
  saveSocketToUser,
  removeSocketFromUser,
  findSocketsFromUserIds,
} = require("./controllers/usersController");
const User = require("./models/user");

const app = express();

const port = process.env.PORT || 8080;

require("./config/mongoose");
app.use(require("cors")());
app.use(require("method-override")("X-HTTP-Method-Override"));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/files", filesRouter);
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationsRouter);

app.use(function (error, req, res, next) {
  if (!error.status) {
    console.error("Caught an error", error.stack);
    res.statusMessage = error;
    res.status(400).send({ message: error.toString().replace("Error: ", "") });
  }
});

const server = require("http").createServer(app);

const io = require("socket.io")(server);
io.on("connection", async function (socket) {
  socket.emit("connected");
  try {
    socket.user = await matchTokenWithUser(
      socket.handshake.headers.authorization
    );
    await saveSocketToUser(socket);
    socket.emit("authenticated");
  } catch (error) {
    console.log("Authentication failed. Disconnecting socket ", socket.id);
    socket.emit("unauthorized");
    socket.disconnect("unauthorized");
  }
  socket.on("disconnect", async () => {
    await removeSocketFromUser(socket);
    console.log(`socket ${socket.id} disconnected`);
  });

  socket.on("read-ack", async (data) => {
    console.log("Someone read a private message.");

    const conversation = await Conversation.find(data.conversation_id);

    if (conversation.lastMessage.sender === socket.user._id) return;

    await conversation.save();

    const recipientSockets = await findSocketsFromUserIds(
      conversation.participants
    );

    if (recipientSockets) {
      recipientSockets.forEach((s) => {
        console.log("Emiting to socket: ", s);
        io.to(`${s.socketId}`).emit("event", {
          type: "RECEIVE_READ_ACK",
          data: {
            conversation_id: conversation._id,
            readAck: { message_id: data.message_id, timestamp: data.sentAt },
          },
        });
      });
    }
  });

  socket.on("writing-ack", async (data) => {
    console.log("Someone is writing in a private conversation.");
    data.sender = socket.user._id;

    const recipientSockets = await findSocketsFromUserIds(
      data.conversation_participants
    );

    if (recipientSockets) {
      recipientSockets.forEach((s) => {
        console.log("Emiting to socket: ", s);
        io.to(`${s.socketId}`).emit("writing-private-start", {
          conversation_id: data.conversation_id,
          writing: true,
        });
      });
    }
  });

  socket.on("new-conversation", async (data) => {
    console.log("Someone wants to start a new conversation");
    data.sender = socket.user._id;

    if (!data.text) {
      throw new Error("no text in message");
    } else if (!data.recipient) {
      throw new Error("no recipient");
    }

    const conversation = await createNewConversation(
      data,
      socket.user,
      recipient
    );

    const recipientSockets = await findSocketsFromUserIds(
      conversation.participants
    );

    recipientSockets.forEach((s) => {
      io.to(`${s.socketId}`).emit("default", {
        type: "RECEIVE_NEW_CONVERSATION",
        payload: { conversation },
      });
    });
  });

  socket.on("message", async (message) => {
    console.log("Someone wants to send a private message");
    message.sender = socket.user._id;
    if (!message.text) {
      throw new Error("no text in message");
    } else if (!message.conversation_id) {
      throw new Error("no conversation_id");
    }
    const conversation = await saveMessageToConversation(message);

    const recipientSockets = await findSocketsFromUserIds(
      conversation.participants
    );

    if (recipientSockets) {
      recipientSockets.forEach((s) => {
        console.log("Emiting to socket: ", s);
        io.to(`${s.socketId}`).emit("chat", {
          type: "RECEIVE_NEW_MESSAGE",
          message,
        });
      });
    }
  });
});

app.use(express.static("client/web-build"));

// Website server
if (process.env.NODE_ENV === "test") {
  app.use(express.static("client/web-build"));
}

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
