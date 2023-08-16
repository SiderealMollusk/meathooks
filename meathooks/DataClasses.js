
class MKResult {
    constructor(config = {}) {
      this.success = config.success || false;
      this.message = config.message || '';
      this.data = config.data || null;
      this.action = config.action || '';
      this.arguments = config.arguments || [];
    }
  }

// A class that represents a destination agnostic request to generate text from text.
class MKLLMRequest {
    constructor(config = {}) {
        this.rules = [];
        this.firstPrompt = "";
        this.lastPrompt = "";
        this.messages = [];
    }
};
    
module.exports = { MKResult };