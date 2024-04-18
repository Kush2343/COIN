const mongoose = require('mongoose');

const ethereumSchema = new mongoose.Schema({
    wallet: {
        type: String,
    },
    privateKey: {
        type: String
    }
}, {
    timestamps: true
});

const ethereumModel = mongoose.model('Ethereum', ethereumSchema);

module.exports = ethereumModel;