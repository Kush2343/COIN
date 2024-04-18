const axios = require('axios');

module.exports.getTokenbyPlatform =  async (req, res) => {
    const { platform } = req.params; // Get the platform from the URL parameter
    const url = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';

    try {
        const response = await axios.get(url);
        const tokens = response.data;

        // Filter tokens for the specified platform
        const filteredTokens = tokens.filter(token => token.platforms && token.platforms[platform]);

        res.json(filteredTokens);
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports.getListofPlatform = async (req, res) => {
    const url = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';

    try {
        const response = await axios.get(url);
        const tokens = response.data;

        // Extract unique platforms
        const platforms = new Set();
        tokens.forEach(token => {
            Object.keys(token.platforms).forEach(platform => platforms.add(platform));
        });

        res.json({ platforms: Array.from(platforms) });
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
module.exports.getListofPlatformbyTokenName = async (req, res) => {
    const { tokenName } = req.params; 
    const url = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';

    try {
        const response = await axios.get(url);
        const tokens = response.data;

        // Find the token by name and return its platforms
        const token = tokens.find(token => token.name.toLowerCase() === tokenName.toLowerCase());

        // If token is found, send its platforms, otherwise return an empty object
        const platforms = token ? token.platforms : {};
        
        res.json({ name: tokenName, platforms });
    } catch (error) {
        console.error('Error fetching platforms:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
