const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String,required: true },
  password:{type:String,required: true},
  // RegisteredDate:{type: Number, default: Date.now},
  // KycStatus:{ type: String },
  // EmailStatus:{ type: String },
  // adminStatus:{ type: String },
// country:{type:String},
//  fullname:{type:String},
// DOB:{type:Number,default:Date.now},
// address:{type:String},
// documentupload:{type:String},
// frontimage :{type:String},
// backimage:{type:String},
// selfievideo:{type:String}
});

const AdminModel = mongoose.model('admin', adminSchema);

module.exports = AdminModel;
