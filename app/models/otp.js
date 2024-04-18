const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password:{
    type:Number,
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

const OTPModel = mongoose.model('OTP', otpSchema);

module.exports = OTPModel;