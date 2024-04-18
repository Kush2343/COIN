const mongoose = require('mongoose');

const recaptchaSchema = new mongoose.Schema({
    recaptcha:{
        type: Boolean,
        default: false
    },
    siteKey: {
        type: String
    },
    secretKey: {
        type: String
    }
},{
    timestamps: true
});

const recaptchaModel = mongoose.model('Recaptcha', recaptchaSchema);

module.exports = recaptchaModel;