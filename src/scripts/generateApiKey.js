require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const database = require('../database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generateApiKey = async (labelArg = null) => {
  try {
    console.log('🔑 API Key Generator');
    console.log('==================');
    
    // Connect to database
    await database.connect();
    
    let label;
    
    // Check if label provided as command line argument
    if (labelArg) {
      label = labelArg;
    } else {
      // Get label from user input
      label = await new Promise((resolve, reject) => {
        rl.question('Enter a label for this API key: ', (answer) => {
          resolve(answer.trim());
        });
      });
    }
    
    if (!label) {
      console.log('❌ Error: Label is required');
      if (rl) rl.close();
      database.close();
      process.exit(1);
    }
    
    // Generate API key
    const apiKey = `ollama_${uuidv4().replace(/-/g, '')}`;
    
    // Store in database
    const result = await database.insertApiKey(apiKey, label);
    
    console.log('✅ API Key Generated Successfully!');
    console.log('==================================');
    console.log(`🏷️  Label: ${label}`);
    console.log(`🔑 API Key: ${apiKey}`);
    console.log(`📅 Created: ${new Date().toISOString()}`);
    console.log('');
    console.log('Usage:');
    console.log(`curl -H "X-API-Key: ${apiKey}" \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"prompt": "Hello, how are you?"}' \\`);
    console.log(`     http://localhost:${process.env.PORT || 8100}/api/v1/generate`);
    console.log('');
    console.log('⚠️  Important: Store this API key securely. It will not be shown again.');
    
  } catch (error) {
    console.error('❌ Error generating API key:', error.message);
    if (rl) rl.close();
    database.close();
    process.exit(1);
  } finally {
    if (rl) rl.close();
    database.close();
  }
};

// Handle script execution
if (require.main === module) {
  const labelArg = process.argv[2];
  generateApiKey(labelArg);
}

module.exports = { generateApiKey };
