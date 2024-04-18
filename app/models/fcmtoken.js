const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema(
    {
        fcmtoken: {
            type: String,
            require:true
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Userdata",
            require:true
        },
    }, {
        timestamps: true
    }
);
const fcmTokenModel = mongoose.model('fcmtoken',fcmTokenSchema);

module.exports = fcmTokenModel;