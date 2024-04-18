const { string } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  //   userId: {type:mongoose.Schema.Types.ObjectId,ref:"USEROTP"},
  email: { type: String,unique:true },
  phonenumber: { type: String },
  password: { type: String },
  country: { type: String },
  fullname: { type: String },
  DOB: { type: String },
  address: { type: String },
  pincode: { type: Number },
  documentupload: { type: String, enum: ['Passport', 'Driving License', 'Aadhaar card'] },
  frontimage: { type: String },
  backimage: { type: String },
  selfieimage: { type: String },
  resetOTP: { type: String },
  singintype: { type: String },
  signup: { type: Boolean, default: false },
  verify: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  emailstatus: { type: Boolean, default: false },
  iskyc: { type: Boolean, default: false },
  kycstatus: { type: String, enum: ['approve', 'reject', 'pending'], default: 'pending' },
  sumitedDate: { type: Date },
  hmac: { type: String },
  walletAddress: { type: Object },
},
  {
    timestamps: true,
  }
);

const User = mongoose.model('Userdata', userSchema);

module.exports = User;  