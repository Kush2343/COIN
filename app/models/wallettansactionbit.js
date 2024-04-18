const mongoose = require('mongoose');

const walletTransactionBitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData'
    },
    coinname: {
        type: String,
        required: true
    },
    transactionid: {
        type: String,
    },
    walletAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    transferamount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const WalletTransactionBit = mongoose.model('WalletTransactionBit', walletTransactionBitSchema);

module.exports = WalletTransactionBit;
