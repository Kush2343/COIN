const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    // Id: {
    //     type: mongoose.Schema.Types.ObjectId
    // },
    bankname:{ type: String },
    banknumber:{ type: Number },
    accountnumber:{ type: Number },
    bankholdername:{ type: String},
    ifsccode:{ type: Number },
    primarykey:{ type: Boolean, default: false}
})

const BankDetails = mongoose.model('BankData',bankSchema);

module.exports = BankDetails;