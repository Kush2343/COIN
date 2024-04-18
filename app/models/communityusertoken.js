const mongoose = require('mongoose');

const communityUserTokenSchema = new mongoose.Schema(
    {
        userId: { type:String, required: true}, 
        token: { type:String, required: true}
    },
    {timestamps: true,}
);
const communitytoken = mongoose.model("communityusertoken", communityUserTokenSchema)
module.exports = communitytoken;