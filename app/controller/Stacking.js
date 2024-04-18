const ethers = require('ethers');
const stackingABI = require("../ABI/stackingABI")
const Staking = require('../models/staking');

const stakingContractAddress = process.env.STACKING_BSCTESTNET
const stackingContractABI=stackingABI;
// BSC Testnet provider URL
const bscTestnetUrl = process.env.BSC_TESTNET_URL

// Set up a provider connected to the BSC Testnet
const provider = new ethers.providers.JsonRpcProvider(bscTestnetUrl);

// Initialize the contract instance with the provider
const stakingContract = new ethers.Contract(stakingContractAddress, stackingABI, provider);

//'YOUR_CONTRACT_ADDRESS_ON_BSCTESTNET';
module.exports.stakeTokens = async (req, res) => {
    const { fromAddress, amount } = req.body;
    // const { stakingContract, decimals } = req.networkConfig;

    try {
        // Convert the staking amount to the appropriate unit based on the token's decimals
       // Convert the amount to the correct units (e.g., wei for BSC tokens)
        const amountInWei = ethers.utils.parseEther(amount.toString());
       const amountInWeitest = ethers.utils.parseUnits(amountInWei.toString(), 18);
       console.log(amountInWeitest)
       // Encode the function call to 'stake'
       const txData = stakingContract.interface.encodeFunctionData("stake", [amountInWei]);

       res.json({ success: true, txData});
    } catch (error) {
        console.error(error);   
        res.status(500).json({ success: false, error: error.message });
    }
}

// Function to store the transaction in the database
module.exports.storeStakingTransaction = async (req,res) => {
    // Destructure the required fields from req.body
    const {
        userAddress,
        amount,
        transactionId,
        currency,
        stakingPeriod,
        interestRate,
        endDate
    } = req.body;

    try {
        // Create a new staking transaction record using the destructured variables
        const stakingTransaction = new Staking({
            userAddress,
            amount,
            transactionId,
            currency,
            status: 'completed', // or 'claimed', depending on your logic
            stakingPeriod,
            interestRate,
            endDate // Calculate based on the stakingPeriod and startDate if needed
        });

        // Save the transaction to the database
        const savedTransaction = await stakingTransaction.save();
        console.log('Staking transaction saved successfully:', savedTransaction);

        res.status(201).json(savedTransaction);
    } catch (error) {
        console.error('Error saving staking transaction:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports.fundContract = async (req, res) => {
    const { amount } = req.body; // Get the funding amount from the request body

    try {
        // Convert the amount to the correct units (e.g., wei for ERC20 tokens)
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

        // Encode the function call to 'fundContract'
        const txData = stakingContract.interface.encodeFunctionData("fundContract", [amountInWei]);

        res.json({ success: true, txData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports.useRewardFunds = async (req, res) => {
    const { amount, toAddress } = req.body;

    try {
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

        const txData = stakingContract.interface.encodeFunctionData("useRewardFunds", [amountInWei, toAddress]);

        res.json({ success: true, txData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports.useStakedFunds = async (req, res) => {
    const { amount, toAddress } = req.body;

    try {
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

        const txData = stakingContract.interface.encodeFunctionData("useStakedFunds", [amountInWei, toAddress]);

        res.json({ success: true, txData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports.getTotalStaked = async (req, res) => {
    try {
        const totalStaked = await stakingContract.totalStaked();
        // Assuming USDT has 18 decimal places; adjust if the token uses a different number
        const formattedTotalStaked = ethers.utils.formatUnits(totalStaked, 18);
        res.json({ success: true, totalStaked: formattedTotalStaked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};


    module.exports.getTotalRewardFunds = async (req, res) => {
        try {
            const totalRewardFunds = await stakingContract.totalRewardFunds();
            const formattedtotalRewardFunds = ethers.utils.formatUnits(totalRewardFunds, 18);
            res.json({ success: true, totalRewardFunds: formattedtotalRewardFunds.toString() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    module.exports.getStakeDetails= async (req, res) => {
        const { userAddress } = req.query; // Expect userAddress to be provided as a query parameter

        try {
            if (!userAddress) {
                throw new Error("User address is required");
            }

            const stakeDetails = await stakingContract.stakes(userAddress);
            res.json({ success: true, stakeDetails });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    module.exports.getTotalBalance=async (req, res) => {
        try {
            const totalBalance = await stakingContract.getTotalBalance();
            const formattedtotalBalance = ethers.utils.formatUnits(totalBalance, 18);
            res.json({ success: true, totalBalance: formattedtotalBalance.toString() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    module.exports.getClaimTxData=async(req, res) => {
        try {
            // Encode the function call to 'claim'
            const txData = stakingContract.interface.encodeFunctionData("claim");
    
            // Respond with the encoded data
            res.json({ success: true, txData });
        } catch (error) {
            console.error('Error encoding claim transaction:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    module.exports.calculateReward = async (req, res) => {
        try {
            // Assuming `amount` is passed in the request body and stakingContract is already set up
            const { amount } = req.body;
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);    
            // Call the calculateReward function from the smart contract
            const reward = await stakingContract.calculateReward(amountInWei);
    
            // Assuming the reward is in wei, convert it to ether (or any other appropriate unit)
            const formattedReward = ethers.utils.formatUnits(reward, 18);
    
            res.json({ success: true, reward: formattedReward });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
    


    
