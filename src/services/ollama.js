const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_URL;
    this.defaultModel = process.env.OLLAMA_MODEL || 'mistral';
  }

  async generateCompletion(prompt, model = this.defaultModel, stream = false) {
    try {
      const payload = {
        model: model,
        prompt: prompt,
        stream: stream
      };

      const response = await axios.post(this.baseURL, payload, {
        responseType: stream ? 'stream' : 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.error('Ollama API error:', error.message);
      throw new Error(`Ollama API request failed: ${error.message}`);
    }
  }

  async generateChat(messages, model = this.defaultModel, stream = false) {
    try {
      // Convert chat messages to a single prompt
      const prompt = messages.map(msg => {
        const role = msg.role === 'user' ? 'Human' : 'Assistant';
        return `${role}: ${msg.content}`;
      }).join('\n') + '\nAssistant:';

      return await this.generateCompletion(prompt, model, stream);
    } catch (error) {
      console.error('Ollama chat error:', error.message);
      throw error;
    }
  }
}

module.exports = new OllamaService();
