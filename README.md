# Ollama REST API

A secure REST API for interacting with your hosted Ollama instance with API key authentication.

## Features

- 🔐 API Key authentication with SQLite storage
- 🌊 Streaming and non-streaming responses
- 🤖 Support for Mistral and other Ollama models
- 📡 Server-Sent Events (SSE) for real-time streaming
- 🔧 Environment-based configuration
- 🚀 OpenAI-compatible endpoints

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Edit the `.env` file:

```env
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=mistral
PORT=8100
NODE_ENV=development
```

### 3. Generate API Key

```bash
npm run genkey
```

Follow the prompts to create an API key with a label.

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

All endpoints require the `X-API-Key` header with a valid API key.

### Health Check (No Auth Required)

```
GET /health
```

### API Information (No Auth Required)

```
GET /api/info
```

### API Documentation (No Auth Required)

```
GET /docs
GET /api/docs
```

View the complete interactive API documentation in your browser at `http://localhost:8100/docs`

### Generate Completion

```
POST /api/v1/generate
```

**Request Body:**
```json
{
  "prompt": "Explain quantum computing",
  "model": "mistral",
  "stream": false
}
```

**Response:**
```json
{
  "model": "mistral",
  "response": "Quantum computing is...",
  "done": true
}
```

### Chat Completion

```
POST /api/v1/chat
```

**Request Body:**
```json
{
  "messages": [
    {"role": "user", "content": "Hello!"},
    {"role": "assistant", "content": "Hi there!"},
    {"role": "user", "content": "How are you?"}
  ],
  "model": "mistral",
  "stream": false
}
```

### OpenAI-Compatible Completions

```
POST /api/v1/completions
```

**Request Body:**
```json
{
  "prompt": "Once upon a time",
  "model": "mistral",
  "stream": false,
  "max_tokens": 100,
  "temperature": 0.7
}
```

## Streaming

Set `"stream": true` in the request body to enable Server-Sent Events streaming:

```bash
curl -H "X-API-Key: your_api_key" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Tell me a story", "stream": true}' \
     http://localhost:8100/api/v1/generate
```

## Authentication

Include your API key in the `X-API-Key` header:

```bash
curl -H "X-API-Key: ollama_1234567890abcdef" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello world"}' \
     http://localhost:8100/api/v1/generate
```

## Error Responses

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing parameters)
- `401` - Unauthorized (invalid/missing API key)
- `500` - Internal Server Error

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Generate new API keys
npm run genkey
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OLLAMA_URL` | Ollama API endpoint | `http://localhost:11434/api/generate` |
| `OLLAMA_MODEL` | Default model name | `mistral` |
| `PORT` | Server port | `8100` |
| `NODE_ENV` | Environment mode | `development` |

## Database

API keys are stored in SQLite database at `src/data/api_keys.sqlite`. The database is created automatically on first run.

## Security

- API keys are required for all endpoints (except health check and info)
- Keys are stored securely in SQLite database
- No expiration (keys are permanent until manually removed)
- CORS enabled for cross-origin requests

## License

MIT
