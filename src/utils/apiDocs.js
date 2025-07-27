const generateApiDocs = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ollama REST API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 10px;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .section {
            background: white;
            padding: 30px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .section h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .endpoint {
            margin-bottom: 30px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .endpoint-header {
            padding: 15px 20px;
            background-color: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .method {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.8em;
            margin-right: 10px;
        }
        
        .method.get { background-color: #28a745; color: white; }
        .method.post { background-color: #007bff; color: white; }
        .method.put { background-color: #ffc107; color: black; }
        .method.delete { background-color: #dc3545; color: white; }
        
        .endpoint-path {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 1.1em;
            font-weight: bold;
        }
        
        .endpoint-body {
            padding: 20px;
        }
        
        .code-block {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin: 10px 0;
        }
        
        .auth-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
            color: #856404;
        }
        
        .params-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        .params-table th,
        .params-table td {
            border: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
        }
        
        .params-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        
        .required {
            color: #dc3545;
            font-weight: bold;
        }
        
        .optional {
            color: #6c757d;
        }
        
        .try-it {
            background-color: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 4px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .try-it h4 {
            margin-bottom: 10px;
            color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="section">
            <h2>🔐 Authentication</h2>
            <p>All API endpoints (except health check and documentation) require authentication using an API key.</p>
            <div class="auth-note">
                <strong>Header Required:</strong> <code>X-API-Key: your_api_key_here</code>
            </div>
        </div>

        <div class="section">
            <h2>📋 Base Information</h2>
            <table class="params-table">
                <tr>
                    <th>Base URL</th>
                    <td><code>https://ai-api.thevv.me</code></td>
                </tr>
                <tr>
                    <th>Content-Type</th>
                    <td><code>application/json</code></td>
                </tr>
                <tr>
                    <th>Streaming</th>
                    <td>Server-Sent Events (SSE)</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>🛠️ Endpoints</h2>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="endpoint-path">/health</span>
                </div>
                <div class="endpoint-body">
                    <p><strong>Description:</strong> Health check endpoint (no authentication required)</p>
                    <h4>Response:</h4>
                    <div class="code-block">{
  "status": "healthy",
  "timestamp": "2025-07-26T05:59:02.743Z",
  "service": "Ollama REST API"
}</div>
                    <div class="try-it">
                        <h4>Try it:</h4>
                        <div class="code-block">curl https://ai-api.thevv.me/health</div>
                    </div>
                </div>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="endpoint-path">/api/info</span>
                </div>
                <div class="endpoint-body">
                    <p><strong>Description:</strong> API information (no authentication required)</p>
                    <h4>Response:</h4>
                    <div class="code-block">{
  "name": "Ollama REST API",
  "version": "1.0.0",
  "endpoints": {
    "generate": "/api/v1/generate",
    "chat": "/api/v1/chat",
    "completions": "/api/v1/completions"
  },
  "authentication": "API Key required in X-API-Key header",
  "streaming": "Supported via stream parameter"
}</div>
                </div>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-path">/api/v1/generate</span>
                </div>
                <div class="endpoint-body">
                    <div class="auth-note">🔒 Requires API Key</div>
                    <p><strong>Description:</strong> Generate text completion using Ollama</p>
                    
                    <h4>Parameters:</h4>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>prompt</td>
                            <td>string</td>
                            <td class="required">Yes</td>
                            <td>The text prompt to generate from</td>
                        </tr>
                        <tr>
                            <td>model</td>
                            <td>string</td>
                            <td class="optional">No</td>
                            <td>Model name (default: mistral)</td>
                        </tr>
                        <tr>
                            <td>stream</td>
                            <td>boolean</td>
                            <td class="optional">No</td>
                            <td>Enable streaming response (default: false)</td>
                        </tr>
                    </table>

                    <h4>Request Example:</h4>
                    <div class="code-block">{
  "prompt": "Explain quantum computing in simple terms",
  "model": "mistral",
  "stream": false
}</div>

                    <div class="try-it">
                        <h4>Try it:</h4>
                        <div class="code-block">curl -H "X-API-Key: your_api_key" \\
     -H "Content-Type: application/json" \\
     -d '{"prompt": "Hello, how are you?"}' \\
     https://ai-api.thevv.me/api/v1/generate</div>
                    </div>

                    <h4>Streaming Example:</h4>
                    <div class="code-block">curl -H "X-API-Key: your_api_key" \\
     -H "Content-Type: application/json" \\
     -d '{"prompt": "Tell me a story", "stream": true}' \\
     https://ai-api.thevv.me/api/v1/generate</div>
                </div>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-path">/api/v1/chat</span>
                </div>
                <div class="endpoint-body">
                    <div class="auth-note">🔒 Requires API Key</div>
                    <p><strong>Description:</strong> Chat completion with conversation history</p>
                    
                    <h4>Parameters:</h4>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>messages</td>
                            <td>array</td>
                            <td class="required">Yes</td>
                            <td>Array of message objects with role and content</td>
                        </tr>
                        <tr>
                            <td>model</td>
                            <td>string</td>
                            <td class="optional">No</td>
                            <td>Model name (default: mistral)</td>
                        </tr>
                        <tr>
                            <td>stream</td>
                            <td>boolean</td>
                            <td class="optional">No</td>
                            <td>Enable streaming response (default: false)</td>
                        </tr>
                    </table>

                    <h4>Request Example:</h4>
                    <div class="code-block">{
  "messages": [
    {"role": "user", "content": "Hello!"},
    {"role": "assistant", "content": "Hi there! How can I help you?"},
    {"role": "user", "content": "What's the weather like?"}
  ],
  "model": "mistral",
  "stream": false
}</div>

                    <div class="try-it">
                        <h4>Try it:</h4>
                        <div class="code-block">curl -H "X-API-Key: your_api_key" \\
     -H "Content-Type: application/json" \\
     -d '{"messages": [{"role": "user", "content": "Hello!"}]}' \\
     https://ai-api.thevv.me/api/v1/chat</div>
                    </div>
                </div>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-path">/api/v1/completions</span>
                </div>
                <div class="endpoint-body">
                    <div class="auth-note">🔒 Requires API Key</div>
                    <p><strong>Description:</strong> OpenAI-compatible text completions</p>
                    
                    <h4>Parameters:</h4>
                    <table class="params-table">
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>prompt</td>
                            <td>string</td>
                            <td class="required">Yes</td>
                            <td>The text prompt to complete</td>
                        </tr>
                        <tr>
                            <td>model</td>
                            <td>string</td>
                            <td class="optional">No</td>
                            <td>Model name (default: mistral)</td>
                        </tr>
                        <tr>
                            <td>stream</td>
                            <td>boolean</td>
                            <td class="optional">No</td>
                            <td>Enable streaming response (default: false)</td>
                        </tr>
                        <tr>
                            <td>max_tokens</td>
                            <td>integer</td>
                            <td class="optional">No</td>
                            <td>Maximum tokens to generate</td>
                        </tr>
                        <tr>
                            <td>temperature</td>
                            <td>float</td>
                            <td class="optional">No</td>
                            <td>Sampling temperature (0.0 to 2.0)</td>
                        </tr>
                    </table>

                    <h4>Request Example:</h4>
                    <div class="code-block">{
  "prompt": "Once upon a time",
  "model": "mistral",
  "stream": false,
  "max_tokens": 100,
  "temperature": 0.7
}</div>

                    <h4>Response Format (OpenAI Compatible):</h4>
                    <div class="code-block">{
  "id": "chatcmpl-1690350342457",
  "object": "text_completion",
  "created": 1690350342,
  "model": "mistral",
  "choices": [{
    "text": "...generated text...",
    "index": 0,
    "logprobs": null,
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  }
}</div>

                    <div class="try-it">
                        <h4>Try it:</h4>
                        <div class="code-block">curl -H "X-API-Key: your_api_key" \\
     -H "Content-Type: application/json" \\
     -d '{"prompt": "The future of AI is"}' \\
     https://ai-api.thevv.me/api/v1/completions</div>
                    </div>
                </div>
            </div>
        </div>

        
        <div class="section">
            <h2>⚠️ Error Responses</h2>
            <h3>401 Unauthorized</h3>
            <div class="code-block">{
  "error": "API key required",
  "message": "Please provide an API key in the X-API-Key header"
}</div>

            <h3>400 Bad Request</h3>
            <div class="code-block">{
  "error": "Missing required parameter",
  "message": "Prompt is required"
}</div>

            <h3>500 Internal Server Error</h3>
            <div class="code-block">{
  "error": "Generation failed",
  "message": "Ollama API request failed: connection refused"
}</div>
        </div>

        <div class="section">
            <h2>🌊 Streaming Response Format</h2>
            <p>When <code>stream: true</code> is set, the API returns Server-Sent Events (SSE). Each event contains:</p>
            <div class="code-block">data: {"model":"mistral","response":"Hello","done":false}

data: {"model":"mistral","response":" there","done":false}

data: {"model":"mistral","response":"!","done":true}

data: [DONE]</div>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = { generateApiDocs };
