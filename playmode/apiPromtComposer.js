// apiPromptComposer.js

class ApiPromptComposer {
    static compose(actionRequest) {
      const command = actionRequest.getCommand();
      const userMessage = actionRequest.getOriginalInput();
  
      // Compose the API prompt based on the ActionRequest
      const apiPrompt = `User command: ${command}\nUser message: ${userMessage}`;
      return apiPrompt;
    }
  }
  
  module.exports = {
    ApiPromptComposer
  };
  