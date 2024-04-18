
const mongoose = require('mongoose')

const communityuserSchema = new mongoose.Schema({
email:{
    type:String,
    uniqe:true
},
password:{
    type:String
},
confirmpassword:{
    type:String,
},
name:{
    type:String
}
},{
    timestamps:true
})

const communityuserModel = mongoose .model('communityuser',communityuserSchema)
module.exports = communityuserModel