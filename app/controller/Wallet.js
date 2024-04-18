const User = require('../models/users');
const ethers = require('ethers');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports.GenerateKey = () => {
    function generateKey() {
        return crypto.randomBytes(32).toString('hex');  // Generates a 256-bit key
    }
    
    const encryptionKey = generateKey();
    const hmacKey = generateKey();
    
    console.log("Encryption Key:", encryptionKey);
    console.log("HMAC Key:", hmacKey);
}

module.exports.registerWalletUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
        // Check if the email already exists
 const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
          return res.status(409).json({ error: 'Email already in use.' });
        }

    const wallet = ethers.Wallet.createRandom();
    const seedPhrase = wallet.mnemonic.phrase;
    
    // This should ideally be done client-side
    const encryptedSeedPhrase = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY).update(seedPhrase, 'utf8', 'hex') + crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY).final('hex');

    const hmac = crypto.createHmac('sha256', process.env.HMAC_SECRET).update(seedPhrase).digest('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email:email, password: hashedPassword, hmac ,walletAddress:wallet});
    await newUser.save();

    res.status(201).json({ seedPhrase ,encryptedSeedPhrase,hmac,hashedPassword});
  } catch (error) {
    next(error);
  }
};


module.exports.VerifyPhrase = async (req, res) => {
    const { email, seedPhrase } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Generate HMAC for the provided seed phrase
        const inputHmac = crypto.createHmac('sha256', process.env.HMAC_SECRET).update(seedPhrase).digest('hex');
        
        // Compare with stored HMAC
        if (inputHmac === user.hmac) {
            res.status(200).json({status:1, message: 'Seed phrase verification successful' });
        } else {
            res.status(401).json({ status:0, message: 'Seed phrase verification failed' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error });
    }
}


// Binance Smart Chain provider URL
const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_TESTNET_URL);

// Function to fetch wallet balance and retrieve wallet address from MongoDB
module.exports.fetchBalanceAndRetrieveWallet = async(req,res) => {
    const { email } = req.body;
    try {
        // Retrieve user from MongoDB (replace 'email' with your user identifier)
        const user = await User.findOne({ email });
        if (!user || !user.walletAddress || user.walletAddress.length === 0) {
            console.log('User not found or no wallets associated.');
            return;
        }

        // Assume the first wallet in the user's wallets array
        const walletAddress = user.walletAddress.address;

        // Fetch the balance
        const balance = await provider.getBalance(walletAddress);
        const balanceInBNB = ethers.utils.formatUnits(balance, 'ether');

        console.log('Wallet Address:', walletAddress);
        console.log('Balance:', balanceInBNB, 'BNB');
        res.status(200).json({status:1, balanceInBNB});
    } catch (error) {
        console.error('Error:', error);
    } 

}