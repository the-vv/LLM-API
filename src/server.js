require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./database');
const { authenticateApiKey } = require('./middleware/auth');
const apiRoutes = require('./routes/api');

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
  console.error('Global error handler:', error);
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
      console.log(`🚀 Ollama REST API server running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`📖 API info: http://localhost:${PORT}/api/info`);
      console.log(`🔑 Generate API key: npm run genkey`);
      console.log(`🌍 Ollama URL: ${process.env.OLLAMA_URL}`);
      console.log(`🤖 Default model: ${process.env.OLLAMA_MODEL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  database.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  database.close();
  process.exit(0);
});

startServer();
