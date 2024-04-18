const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogimg: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        required: true
    },
    publishon: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    videourl: {
        type: String,
        required: true
    },
    pageview: {
        type: Number,
        default: 0,
    },

},
    {
        timestamps: true,
    }
);

const blogModel = mongoose.model('blog', blogSchema);

module.exports = blogModel;