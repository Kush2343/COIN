const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
    {
        topicname: {
            type: String,
            require:true
        },
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'category',
            require:true
        },
        tagsId:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"tags",
        }],
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"communityuser",
            require:true
        },
    views : {
        type :Number,
        default: 0,
    },
        approve: { type: Boolean, default: false},
        description:{type:String}
    }, {
        timestamps: true
    }
);
const topicModel = mongoose.model('topic',topicSchema);

module.exports = topicModel;