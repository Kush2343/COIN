const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    url: { type: String },
    title: { type: String },
    description: { type: String },
    thumbnail: { type: String },
    createdAt: { type: Date },
});

const News = mongoose.model("News", newsSchema);

module.exports = News;