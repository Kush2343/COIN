const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    markerFee: {
        type: Number,
        require: true
    },
    totalFee: {
        type: Number,
        require: true
    },
    disableTrade: {
        type: Boolean,
        default: true
    },  
},{
    timestamps: true,
});

const tradeModel = mongoose.model('trade',tradeSchema);

module.exports = tradeModel;