const mongoose = require('mongoose');

const categoryschema = new mongoose.Schema(
    {
        category: { type: String,require:true},

        // approve: { type: Boolean, default: false},
        
    },
    {timestamps:true}
);
const categoryModel = mongoose.model("category",categoryschema);

module.exports = categoryModel;