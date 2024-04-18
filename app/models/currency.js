const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    currencyname: {
        type: String,
        required:true,
    },
    symbol: {
        type: String,
        required:true
    },
    sign: {
        type: String,
        required:true
    },
    price: {
        type: String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    currencyimg: {
        type: String,
        required:true
    }
},
    {
        timestamps: true,
    }
);

const currencyModel = mongoose.model('currency', currencySchema);

module.exports = currencyModel;