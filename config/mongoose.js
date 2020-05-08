const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/dauphineSIEEGATE",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to Atlas");
});

mongoose.connection.on("error", () => {
  console.log("Error while attempting to connect to Atlas");
});
