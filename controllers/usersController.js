const User = require("../models/user");

exports.saveSocketToUser = async function (socket) {
  try {
    const user = await User.findById(socket.user._id);
    user.sockets = [
      ...user.sockets.filter((sock) => sock.ip !== socket.handshake.address),
      { ip: socket.handshake.address, socketId: socket.id },
    ];
    await user.save();
    console.log(`Socket ${socket.id} saved to ${socket.user._id}`);
  } catch (err) {
    console.log(err);
  }
};

exports.removeSocketFromUser = async function (socket) {
  try {
    await User.findByIdAndUpdate(socket.user._id, {
      $pull: {
        sockets: { socketId: socket.id },
      },
    });
    console.log(`Socket ${socket.id} deleted.`);
  } catch (err) {
    console.log(err);
  }
};

exports.findSocketsFromUserIds = async function (data) {
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
    } else {
      const { sockets } = await User.findById(data).select("sockets -_id");
      return sockets;
    }
  } catch (err) {
    console.log(err);
  }
};
