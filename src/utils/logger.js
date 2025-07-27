const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure daily rotating file transport
const dailyRotateFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'log-%DATE%.txt'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '90d', // Keep logs for 90 days
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      if (Object.keys(meta).length > 0) {
        log += ` | ${JSON.stringify(meta)}`;
      }
      return log;
    })
  )
});

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  transports: [
    dailyRotateFileTransport,
    // Also log to console in development
    ...(process.env.NODE_ENV === 'development' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : [])
  ]
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  const requestInfo = {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    apiKey: req.headers['x-api-key'] ? 'provided' : 'none'
  };
  
  // Override res.end to capture response info
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    // Log response
    const responseInfo = {
      ...requestInfo,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || '0'
    };
    
    logger.info('Request processed', responseInfo);
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Handle log rotation events
dailyRotateFileTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info('Log file rotated', { oldFilename, newFilename });
});

dailyRotateFileTransport.on('new', (newFilename) => {
  logger.info('New log file created', { filename: newFilename });
});

module.exports = {
  logger,
  requestLogger
};
