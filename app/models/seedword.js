const mongoose = require('mongoose');

const SeedSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    seed: {
        type: [String], 
        required: true
    },
    selectedseed:{
        type: [String], 
        required: true
    }
});

const Seed = mongoose.model('Seed', SeedSchema);

module.exports = Seed;