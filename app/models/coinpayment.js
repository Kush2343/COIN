const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
    IPNsecret: {
        type: String,
    },
    publicKey: {
        type: String,
    },
    privateKey: {
        type: String,
    },
    merchantID: {
        type: String,
    },
    payDepositeFee: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const coinModel = mongoose.model('coinpayment', coinSchema);

module.exports = coinModel;