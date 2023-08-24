class PromptCommand {
    constructor(meathooks, config) {
      if(!meathooks) throw new Error('PromptCommand requires a meathooks instance');
      this.meathooks = meathooks;
      this.choices = config.choices;
      this.innerHandler= config.innerHandler || this.defaultInnerHandleInput;
      this.logUserPrompt = config.logUserPrompt || defaultlogUserPrompt;
      this.logChoices = config.logChoices || this.logChoices;
      this.handleInput = function(input){
        const cmdData = this.innerHandler({"foo":"bar"},input);
        //null check
        if(cmdData){
          return new PromptCommand(meathooks, cmdData);
        }
        return null;
      }
    }
  
    defaultlogUserPrompt() {
      console.log('Please choose one of the following:');
      this.choices
    }

    defaultInnerHandleInput(inject, inputString) {
      const choice = this.choices[inputString];
      if (choice) {
        return choice.action(inject);
      } else {
        console.log('Invalid input');
        return this;
      }
    }
  
    logChoices() {
      for (const key in this.choices) {
        const value = this.choices[key].label;
        console.log(`${key}) ${value}`);
      }
    }
  
    makeBold(text) {
      // ANSI escape code for bold text
      const boldCode = '\x1b[1m';
      const resetCode = '\x1b[0m'; // Reset formatting code
      return boldCode + text + resetCode;
    }
  }
  
  module.exports = PromptCommand;
  