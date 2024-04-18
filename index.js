const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

require("./config");
require("dotenv").config();
const PORT = process.env.PORT || 443;
const path = require("path");
const cron = require('node-cron');
const fileUpload = require('express-fileupload');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));

app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const multer = require("multer");
// app.use(multer({storage: multer.memoryStorage()}).any())
app.use(cors());

require("./app/routes/Adminroute")(app);
require("./app/routes/Userroute")(app);

const fs = require('fs');
const { fetchAndSaveNews } = require("./app/news/newsService");

const uploadFolderPath = './app/upload';
// Check if the upload folder exists
if (!fs.existsSync(uploadFolderPath)) {
  // If not, create the upload folder
  fs.mkdirSync(uploadFolderPath);
  console.log('Upload folder created successfully.');
} else {
  console.log('Upload folder already exists.');
}

cron.schedule('0 */12 * * *', () => {
  fetchAndSaveNews();
});

app.get("/",(req,res)=>{
  res.json("Hello")
})
app.listen(PORT, () => {
  console.log(`PORT Listening ${PORT}`);
});