const express = require('express');
const ollamaService = require('../services/ollama');
const { logger } = require('../utils/logger');
const router = express.Router();

// In-memory cache for quotes
const quoteCache = {
  quote: null,
  weekday: null,
  timestamp: null
};

// Helper function to get current weekday
const getCurrentWeekday = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const indiaTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const date = new Date(indiaTime);
    return days[date.getDay()];
};

// Helper function to check if cache is valid (same weekday and within 24 hours)
const isCacheValid = () => {
  if (!quoteCache.quote || !quoteCache.weekday || !quoteCache.timestamp) {
    return false;
  }
  
  const currentWeekday = getCurrentWeekday();
  const now = Date.now();
  const cacheAge = now - quoteCache.timestamp;
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  return (
    quoteCache.weekday === currentWeekday && 
    cacheAge < twentyFourHours
  );
};

// Weekday quotes endpoint
router.get('/weekday-quote-in', async (req, res) => {
  try {
    const currentWeekday = getCurrentWeekday();
    
    // Check if we have a valid cached quote
    if (isCacheValid()) {
      logger.info('Returning cached weekday quote', { 
        weekday: currentWeekday,
        cacheAge: Date.now() - quoteCache.timestamp 
      });
      
      return res.json({
        quote: quoteCache.quote,
        weekday: currentWeekday,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // Generate new quote
    const prompt = `You are my personal work buddy. Every weekday, you will give me one short, funny, and slightly sarcastic motivational message to help me get through the day. 
    
    Keep it casual and related to work or coding life. Make sure it's light-hearted and specific to the day of the week. Skip weekends — just say something fun like this but not same as: "It's weekend! Go touch grass 🌿" on Saturday or Sunday. Don't say like monday blues? or similar as beginning.
    Only weekday quote as text, no surrounding quotes, only plain text and emojis if required. nothing else. otherwise, system will break. Also make it short like only around 20 chars long. also make it funny a bit but office friendly. FYI, I am a Senior Front End Developer.
    
    Today's weekday is: ${currentWeekday}
    
    Now give me the message for this day.`;

    logger.info('Generating new weekday quote', { weekday: currentWeekday });
    
    const response = await ollamaService.generateCompletion(prompt);
    
    if (response.data && response.data.response) {
      let quote = response.data.response.trim();

      try {
        quote = JSON.parse(quote) // for removing surrounding quotes
      } catch {}
      
      // Update cache
      quoteCache.quote = quote;
      quoteCache.weekday = currentWeekday;
      quoteCache.timestamp = Date.now();
      
      logger.info('Generated and cached new weekday quote', { 
        weekday: currentWeekday,
        quoteLength: quote.length 
      });
      
      res.json({
        quote: quote,
        weekday: currentWeekday,
        cached: false,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Invalid response from Ollama service');
    }
    
  } catch (error) {
    logger.error('Error generating weekday quote', { 
      error: error.message,
      weekday: getCurrentWeekday() 
    });
    
    res.status(500).json({
      error: 'Failed to generate weekday quote',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Health check for utils
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Utils API',
    endpoints: {
      'weekday-quote': '/utils/weekday-quote'
    },
    cache: {
      hasQuote: !!quoteCache.quote,
      weekday: quoteCache.weekday,
      cacheAge: quoteCache.timestamp ? Date.now() - quoteCache.timestamp : null
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
