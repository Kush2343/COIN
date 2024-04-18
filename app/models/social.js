const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
    youtube: {
        type: String,
    },
    telegram: {
        type: String,
    },
    facebook:{
        type: String,
    },
    twitter: {
        type: String,
    },
    reddit: {
        type: String,
    },
    instagram: {
        type: String,
    },
    discore: {
        type: String,
    },
    medium: {
        type: String,
    }
}, {
    timestamps: true
});

const socialModel = mongoose.model('social', socialSchema);

module.exports = socialModel;