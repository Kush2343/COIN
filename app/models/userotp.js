const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: true,
  },
  phonenumber:{
    type:String,
    // required:true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
},
},
{
    timestamps: true,
}
  );

const Userotp = mongoose.model('USEROTP', otpSchema);

module.exports = Userotp;