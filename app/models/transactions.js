const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    fromWalletId: {
        type: String,
        required: true
    },
    toWalletId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    tokenDetails: {
        tokenSymbol: { type: String, required: false },
        tokenName: { type: String, required: false },
        tokenType: { type: String, required: false }  // Examples: 'ERC-20', 'ERC-721', 'Native'
    },
    transferType: {
        type: String,
        enum: ['send', 'receive'],
        required: true
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
