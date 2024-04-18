const mongoose = require('mongoose');

const tronSchema = new mongoose.Schema({
    wallet: {
        type: String,
    },
    privateKey: {
        type: String
    }
}, {
    timestamps: true
});

const tronModel = mongoose.model('Tron', tronSchema);

module.exports = tronModel;