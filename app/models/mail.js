const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
    Type: {
        type: String,require: true
    },
    SMTPhost: {
        type: String, require: true,
    },
    SMTPport: {
        type: Number, require: true,
    },
    username: {
        type: String, require: true, 
    },
    password: {
        type: String, require: true,
    },
    senderName: {
        type: String, require: true,
    }, 
    senderEmail: {
        type: String, require: true
    },
    encryption: {
        type: String, require: true,
    }
},{
    timestamps:true
});
 
const mailModel = mongoose.model('mail',mailSchema);

module.exports = mailModel;