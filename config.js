const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
mongoose.connect(MONGO_CONNECTION, 
  // { useNewUrlParser: true, useUnifiedTopology: true
  //  }
  );
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
 
});
// exports.modules.config