// const mongoose = require('mongoose');

// const stakingSchema = new mongoose.Schema({
//     currency: { type: String, required: true },
//     status: { type: String, required: true },
//     minStakingAmount: { type: Number, required: true },
//     maxStakingAmount: { type: Number, required: true },
//     allowedDays: { type: [Number], required: true },
//     allowedPercentages: { type: [Number], required: true }
// });

// const Staking = mongoose.model('Staking', stakingSchema);

// module.exports = Staking;
const mongoose = require('mongoose');

const stakingSchema = new mongoose.Schema({
    userAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' }, // Example: pending, completed, failed
    stakingPeriod: { type: Number, required: true }, // in days
    interestRate: { type: Number, required: true }, // Example: 5 for 5%
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
});

const Staking = mongoose.model('Staking', stakingSchema);

module.exports = Staking;
