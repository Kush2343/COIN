const mongoose = require("mongoose")

const walletSchema = new mongoose.Schema({
      amount:{
        type:Number,
        default:0
    },
      userId:{
        type:mongoose.Schema.Types.ObjectId
    }
    })
    
    const walletModel = mongoose .model('wallet',walletSchema)
    module.exports = walletModel