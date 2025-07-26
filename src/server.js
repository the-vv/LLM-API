require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./database');
const { authenticateApiKey } = require('./middleware/auth');
const apiRoutes = require('./routes/api');
const { generateApiDocs } = require('./utils/apiDocs');
const { logger, requestLogger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 8100;

// Create data directory if it doesn't exist
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Add request logging middleware

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Ollama REST API'
  });
});

// API info endpoint (no auth required)
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Ollama REST API',
    version: '1.0.0',
    endpoints: {
      generate: '/api/v1/generate',
      chat: '/api/v1/chat',
      completions: '/api/v1/completions'
    },
    authentication: 'API Key required in X-API-Key header',
    streaming: 'Supported via stream parameter'
  });
});

// API documentation endpoint (no auth required)
app.get('/docs', (req, res) => {
  res.send(generateApiDocs());
});

app.get('/api/docs', (req, res) => {
  res.send(generateApiDocs());
});

// Protected API routes
app.use('/api/v1', authenticateApiKey, apiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handler
app.use((error, req, res, next) => {
  logger.error('Global error handler', { 
    error: error.message, 
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await database.connect();
    
    app.listen(PORT, () => {
      const startupMessage = `🚀 Ollama REST API server running on port ${PORT}`;
      console.log(startupMessage);
      logger.info('Server started', { port: PORT, environment: process.env.NODE_ENV });
      
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`📖 API info: http://localhost:${PORT}/api/info`);
      console.log(`📚 API docs: http://localhost:${PORT}/docs`);
      console.log(`🔑 Generate API key: npm run genkey`);
      console.log(`🌍 Ollama URL: ${process.env.OLLAMA_URL}`);
      console.log(`🤖 Default model: ${process.env.OLLAMA_MODEL}`);
      console.log(`📝 Logs directory: ./logs/`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  logger.info('Server shutdown initiated', { signal: 'SIGINT' });
  database.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  logger.info('Server shutdown initiated', { signal: 'SIGTERM' });
  database.close();
  process.exit(0);
});

startServer();
