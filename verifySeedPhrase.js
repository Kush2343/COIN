const crypto = require('crypto');

// Secret key for HMAC (in a real application, store this securely and keep it secret)
const HMAC_SECRET = 'your_very_secure_secret_key';

// Static seed phrase for testing
const seedPhrase = "stay ecology menu vital heart butter dawn you various victory bunker ball";
const seedWords = seedPhrase.split(' ');

// Positions to check: the first, sixth, and the last word of the seed phrase
const positionsToCheck = [0, 5, seedWords.length - 1];

// Function to generate HMAC for each word
function generateHmacs(words, secret) {
    return words.map(word => crypto.createHmac('sha256', secret).update(word).digest('hex'));
}

// Generate HMACs for the seed phrase words
const seedWordHmacs = generateHmacs(seedWords, HMAC_SECRET);

// Function to manually verify selected words against their stored HMACs
function verifySelectedWords(words, hmacs, indicesToCheck, secret) {
    return indicesToCheck.every(index => {
        const wordHmac = crypto.createHmac('sha256', secret).update(words[index]).digest('hex');
        return wordHmac === hmacs[index];
    });
}

// Words to verify (normally, user input or selected from a UI)
const wordsToVerify = [seedWords[0], seedWords[5], seedWords[seedWords.length - 1]];

// Perform the verification
const isValid = verifySelectedWords(seedWords, seedWordHmacs, positionsToCheck, HMAC_SECRET);
console.log('Verification Status:', isValid ? 'Successful' : 'Failed');
