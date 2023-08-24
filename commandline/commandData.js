const PromptCommand = require('./PromptCommand');
commandData = {

    initial: {
      logUserPrompt: function() { 
        console.log('Welcome To Meathooks! Please Choose:');
        this.logChoices();
       },
      choices: {
        'a': {
          label: 'Load a project',
          action: function() { 
            return commandData.loadProject_Select;
          }
        },
        'b': {
          label: 'Create a project',
          action: function() {
            console.log('Creating a project...');
            return commandData.initial;
          }
        },
        'c': {
          label: 'Exit',
          action: function() {
            console.log('Exiting...');
            return;
          }
        }
      }
    },
    loadProject_Select: {
      logUserPrompt: function(inject) {
        console.log('Please choose a project to load:');
        this.logChoices(inject);
      },
      logChoices: function(inject) {
        //list of the objects in inject.meathooks
        console.log(inject);
      }
    }
  }

module.exports = commandData;