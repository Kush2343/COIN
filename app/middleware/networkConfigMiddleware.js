// middleware/networkConfigMiddleware.js
const ethers = require('ethers');
const USDTABI = require("../ABI/usdttoken");
const ABI = require("../ABI/abi");

const networks = {
    sepolia: {
        url: process.env.ETH_SEPOLIA_URL,
        usdtTokenAddress: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
        usdtTransferAddress: "0x9a69b64aa25FB781412e9Dd49e0f68DC771a5f75",
        decimals: 6
    },
    bsctestnet: {
        url: process.env.BSC_TESTNET_URL,
        usdtTokenAddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
        usdtTransferAddress: "0x862c2DAcb215E98E01930C19B9a8B9e695915E29",
        decimals: 18
    }
};

const networkConfigMiddleware = (req, res, next) => {
    const network = req.query.network || 'bsctestnet';
    const config = networks[network];

    if (!config) {
        return res.status(404).json({ success: false, error: "Network not supported" });
    }

    const provider = new ethers.providers.JsonRpcProvider(config.url);
    req.networkConfig = {
        usdtContract: new ethers.Contract(config.usdtTokenAddress, USDTABI, provider),
        transferContract: new ethers.Contract(config.usdtTransferAddress, ABI, provider),
        decimals: config.decimals
    };

    next();
};

module.exports = networkConfigMiddleware;
