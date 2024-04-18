const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    like: {
        type:Number,
        default:0
    },
    description:{
        type:String,
    },
    topicId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"topic",
        require:true
    },
    Solution:{
        type: Boolean,
        default:false
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"communityuser",
        require:true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
}, {
    timestamps:true
});

const commentModel = mongoose.model("comment",commentSchema);

module.exports = commentModel;