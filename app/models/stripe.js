const mongoose = require('mongoose');

const stripeSchema = new mongoose.Schema({
    publicKey: {
        type: String
    },
    secretKey:{
        type : String,
    },
    baseCurrency: {
        type: String
    }
},{
    timestamps:true
});

const stripeModel = mongoose.model('stripe', stripeSchema);

module.exports = stripeModel;