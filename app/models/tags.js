const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema(
    {
        tags: { type: String,required:true },
    
        // approve: { type: Boolean, default: false}
    },
    {timestamps:true}
);
const tagsModel = mongoose.model('tags',tagsSchema);

module.exports = tagsModel;