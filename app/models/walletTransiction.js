const mongoose = require('mongoose')

const walletTransictionSchema = new mongoose.Schema({
    bankdetails: {
        type: mongoose.Schema.Types.ObjectId
    },
    amount: {
        type: Number
    },
    transictiontype: {
        type: String,
        enum: ['deposit', 'withdraw']
    },
    status: {
        type: String,
        enum: ['successful', 'pending', 'fail']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    transactionId: {
        type: String
    },
    changestatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})

const walletTransictionModel = mongoose.model('wallettransiction', walletTransictionSchema)
module.exports = walletTransictionModel