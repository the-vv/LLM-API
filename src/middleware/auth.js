const database = require('../database');

const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        message: 'Please provide an API key in the X-API-Key header'
      });
    }

    const keyRecord = await database.findApiKey(apiKey);
    
    if (!keyRecord) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is not valid'
      });
    }

    // Update last used timestamp
    await database.updateLastUsed(apiKey);
    
    // Add key info to request object
    req.apiKey = keyRecord;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};

module.exports = { authenticateApiKey };
