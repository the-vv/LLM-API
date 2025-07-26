const express = require('express');
const ollamaService = require('../services/ollama');
const router = express.Router();

// Generate completion endpoint
router.post('/generate', async (req, res) => {
  try {
    const { prompt, model, stream = false } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'Prompt is required'
      });
    }

    if (stream) {
      // Set headers for Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      const response = await ollamaService.generateCompletion(prompt, model, true);
      
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
            
            if (data.done) {
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
          } catch (parseError) {
            console.error('Error parsing streaming response:', parseError);
          }
        }
      });

      response.data.on('end', () => {
        res.end();
      });

      response.data.on('error', (error) => {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
        res.end();
      });

    } else {
      const response = await ollamaService.generateCompletion(prompt, model, false);
      res.json(response.data);
    }

  } catch (error) {
    console.error('Generate endpoint error:', error);
    res.status(500).json({
      error: 'Generation failed',
      message: error.message
    });
  }
});

// Chat completion endpoint
router.post('/chat', async (req, res) => {
  try {
    const { messages, model, stream = false } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'Messages array is required'
      });
    }

    if (stream) {
      // Set headers for Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      const response = await ollamaService.generateChat(messages, model, true);
      
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
            
            if (data.done) {
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
          } catch (parseError) {
            console.error('Error parsing streaming response:', parseError);
          }
        }
      });

      response.data.on('end', () => {
        res.end();
      });

      response.data.on('error', (error) => {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
        res.end();
      });

    } else {
      const response = await ollamaService.generateChat(messages, model, false);
      res.json(response.data);
    }

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Chat failed',
      message: error.message
    });
  }
});

// Completions endpoint (OpenAI-compatible)
router.post('/completions', async (req, res) => {
  try {
    const { prompt, model, stream = false, max_tokens, temperature } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'Prompt is required'
      });
    }

    if (stream) {
      // Set headers for Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      const response = await ollamaService.generateCompletion(prompt, model, true);
      
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            // Transform to OpenAI-compatible format
            const openAIFormat = {
              id: `chatcmpl-${Date.now()}`,
              object: 'text_completion',
              created: Math.floor(Date.now() / 1000),
              model: data.model || model || 'mistral',
              choices: [{
                text: data.response || '',
                index: 0,
                logprobs: null,
                finish_reason: data.done ? 'stop' : null
              }]
            };
            
            res.write(`data: ${JSON.stringify(openAIFormat)}\n\n`);
            
            if (data.done) {
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
          } catch (parseError) {
            console.error('Error parsing streaming response:', parseError);
          }
        }
      });

      response.data.on('end', () => {
        res.end();
      });

      response.data.on('error', (error) => {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
        res.end();
      });

    } else {
      const response = await ollamaService.generateCompletion(prompt, model, false);
      
      // Transform to OpenAI-compatible format
      const openAIFormat = {
        id: `chatcmpl-${Date.now()}`,
        object: 'text_completion',
        created: Math.floor(Date.now() / 1000),
        model: response.data.model || model || 'mistral',
        choices: [{
          text: response.data.response || '',
          index: 0,
          logprobs: null,
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
      
      res.json(openAIFormat);
    }

  } catch (error) {
    console.error('Completions endpoint error:', error);
    res.status(500).json({
      error: 'Completion failed',
      message: error.message
    });
  }
});

module.exports = router;
