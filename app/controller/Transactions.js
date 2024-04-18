
const Transaction = require('../models/transactions');
const ethers = require('ethers');
const ETHTransferABI = require("../ABI/ETHtransferABI")



// module.exports.SendTransaction = async (req, res) => {
//     const { username, transactionId, fromWalletId, toWalletId, transferType } = req.body;

//     // Basic validation checks
//     if (!username || !transactionId || !fromWalletId || !toWalletId || !transferType) {
//         return res.status(400).json({ success: false, error: 'All fields are required' });
//     }


//     try {
//         const newTransaction = new Transaction({
//             username,
//             transactionId,
//             fromWalletId,
//             toWalletId,
//             timestamp: new Date(),
//             transferType
//         });

//         const savedTransaction = await newTransaction.save();
//         res.status(201).json(savedTransaction);
//     } catch (error) {
//         console.error('Error creating transaction:', error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

module.exports.FetchUserTransactions = async (req, res) => {
    const { username } = req.params;  // assuming the username is passed as a URL parameter

    // Basic validation checks
    if (!username) {
        return res.status(400).json({ success: false, error: 'Username is required' });
    }

    try {
        // Query the database for transactions associated with the username
        const userTransactions = await Transaction.find({ username });

        if (!userTransactions || userTransactions.length === 0) {
            return res.status(404).json({ success: false, error: 'No transactions found for this user' });
        }

        res.status(200).json(userTransactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports.sendUSDTtransfer = async (req, res) => {
    const { fromAddress, toAddress, amount } = req.body;
    const { usdtContract, transferContract, decimals } = req.networkConfig;

    try {
        const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals);
        const txData = transferContract.interface.encodeFunctionData("transferUSDT", [fromAddress, toAddress, amountInWei]);

        res.json({ success: true, txData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports.SendTransaction = async (req, res) => {
    const { username, transactionId, fromWalletId, toWalletId, transferType,tokenDetails } = req.body;

    // Basic validation checks
    if (!username || !transactionId || !fromWalletId || !toWalletId || !transferType || !tokenDetails) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    console.log(tokenDetails)

    try {
        const newTransaction = new Transaction({
            username,
            transactionId,
            fromWalletId,
            toWalletId,
            timestamp: new Date(),
            transferType,
            tokenDetails
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports.SendETHTransaction = async (req,res) => {
     const ContractAddress = process.env.TRANSFER_ETH_ON_BSC_TESTNET
    const ContractABI=ETHTransferABI;
    // BSC Testnet provider URL
    const bscTestnetUrl = process.env.BSC_TESTNET_URL
    
    // Set up a provider connected to the BSC Testnet
    const provider = new ethers.providers.JsonRpcProvider(bscTestnetUrl);
    
    // Initialize the contract instance with the provider
    const Contract = new ethers.Contract(ContractAddress, ContractABI, provider);
    try {
        // Example parameters from request (adjust based on your frontend's request structure)
        const { toAddress, amount } = req.body;

        if (!toAddress || !amount) {
            return res.status(400).json({ error: "toAddress and amount are required" });
        }

        // Convert the amount to Wei. The amount should be passed as a string to avoid precision errors.
        const amountInWei = ethers.utils.parseEther(amount.toString());

        // Encode the transaction data using the contract's interface
        const txData = Contract.interface.encodeFunctionData("transferETH", [toAddress]);

        // Return the encoded data, destination address, and the value to be sent
        res.json({
            success: true,
            to: ContractAddress,
            data: txData,
            value: amountInWei.toString()
        });
    } catch (error) {
        console.error('Error encoding transaction:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}



