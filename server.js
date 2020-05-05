const express = require("express");
const usersRouter = require("./routes/users");
const jobsRouter = require("./routes/jobs");
const filesRouter = require("./routes/files");
const authRouter = require("./routes/auth");
const conversationsRouter = require("./routes/conversations");
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

app.use(
  require("express-fileupload")({
    createParentPath: true,
  })
);
app.use(require("cors")());
app.use(require("method-override")("X-HTTP-Method-Override"));
app.use(express.json());
app.use(require("cors")());

app.use("/api/users", usersRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/files", filesRouter);
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationsRouter);

// Error handler middleware

app.use(function (error, req, res, next) {
  if (!error.status) {
    console.error("Caught an error", error.stack);
    res.statusMessage = error;
    res.status(400).send({ message: error.toString().replace("Error: ", "") });
  }
});

const server = require("http").createServer(app);

// Socket (for full duplex communication)

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

  socket.on("private-conversation", async (data) => {
    console.log("Someone wants to start a new conversation");
    data.sender = socket.user._id;
    if (!data.text) {
      throw new Error("no text in message");
    } else if (!data.recipient) {
      throw new Error("no recipient");
    }

    const recipient = await User.findById(data.recipient).select(
      "-id -password -tokens"
    );

    const { conversation, message } = await createNewConversation(
      data,
      socket.user,
      recipient
    );

    // Sends conversation
    recipient.sockets.forEach((element) => {
      io.to(`${element}`).emit("private-conversation", {
        conversation,
        message,
      });
    });

    // Sends acknowledgment
    socket.emit("private-conversation-ack", { conversation, message });
  });

  socket.on("private-message", async (data) => {
    console.log("Someone wants to send a private message");
    data.sender = socket.user._id;
    if (!data.text) {
      throw new Error("no text in message");
    } else if (!data.conversation_id) {
      throw new Error("no conversation_id");
    }
    const message = await saveMessageToConversation(data);

    const recipientSockets = await findSocketsFromUserIds(message.recipient);

    if (recipientSockets) {
      recipientSockets.forEach((s) => {
        console.log("Emiting to socket: ", s);
        io.to(`${s.socketId}`).emit("private-message", { message });
      });
    }
    socket.emit("private-message-ack", { message });
  });
});

// Website server

app.use(express.static("client/web-build"));
if (process.env.NODE_ENV === "test") {
  app.use(express.static("client/web-build"));
}

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
