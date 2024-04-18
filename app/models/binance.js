const mongoose = require('mongoose');

const binanceSchema = new mongoose.Schema({
    wallet: {
        type: String,
    },
    privateKey: {
        type: String
    }
}, {
    timestamps: true
});

const binanceModel = mongoose.model('Binance', binanceSchema);

module.exports = binanceModel;