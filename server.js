const express = require("express");
const usersRouter = require("./routes/users");
const jobsRouter = require("./routes/jobs");
const filesRouter = require("./routes/files");
const authRouter = require("./routes/auth");
const conversationsRouter = require("./routes/conversations");
const { matchTokenWithUser } = require("./middleware/authenticate");
const { saveMessageInDb } = require("./controllers/messagesController");
const {
  saveSocketToUser,
  removeSocketFromUser,
  findSocketsWithUsers,
} = require("./controllers/usersController");

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

app.use(function (error, req, res, next) {
  if (!error.status) {
    console.error("Caught an error", error.stack);
    res.statusMessage = error;
    res.status(400).send({ message: error.replace("Error: ", "") });
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
  socket.on("message", async function (message) {
    message = {
      ...message,
      sender: socket.user._id,
    };
    if (!message.text) {
      throw new Error("no text in message");
    } else if (!message.recipients && !message.conversation_id) {
      throw new Error("no recipients nor conversation_id");
    }
    const { conversation, savedMessage, newConv } = await saveMessageInDb({
      message: message,
      sender: socket.user._id,
      recipients: message.recipients,
      conversation_id: message.conversation_id,
    });
    const recipientsSockets = await findSocketsWithUsers(
      conversation.participants
    );
    recipientsSockets.forEach((socketId) => {
      io.to(`${socketId}`).emit("message", {
        savedMessage,
        conversation,
        newConv,
      });
    });
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/web-build"));
}

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
