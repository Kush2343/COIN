const mongoose = require('mongoose');
 
const notificationSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    cryptoDeposits :{
        type: Boolean
    },
    cryptoWithdraw: {
        type: Boolean
    },
    flatDeposits: {
        type: Boolean
    },
    flatWithdraw: {
        type: Boolean
    },
    kycRecieved: {
        type: Boolean
    },
    newUseremail: {
        type: Boolean
    }
}, {
    timestamps: true
});

const notificationModel = mongoose.model('notification', notificationSchema);

module.exports = notificationModel;