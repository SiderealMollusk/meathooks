//////////// Requires ////////////
const {Meathooks, MKResult} = require('./meathooks/Meathooks');
const PromptCommand = require('./commandline/PromptCommand');
const commandData = require('./commandline/commandData');
const readline = require('readline');


//////////// Init Meathooks ////////////
const projectsDir = './projects'; // Replace with your projects directory
const meathooks = new Meathooks(projectsDir);

//////////// Start Input Loop ////////////
let currentCommand = new PromptCommand(meathooks, commandData.initial);
let nextCommand;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
inputLoop();

//////////// Functions ////////////

function inputLoop() {
  // Check the current state of the app, and formulate a question to ask the user
  currentCommand.logUserPrompt();
  rl.question('\n', async function(inputString) {
    // Parse the user's input
    nextCommand = currentCommand.handleInput(inputString);

    /*
    if (needNetworkCall) {
      // Make a network call
      console.log('Making a network call...');
      const response = await simulateNetworkCall();
      console.log(response);
    }
    */

    // Recursively call inputLoop() again
    if(nextCommand) {
      currentCommand = nextCommand;
      nextCommand = null;
      inputLoop();
    } else {
        console.log('finished');
        rl.close();
        process.exit();
    }
  });
}

function simulateNetworkCall() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("Network call complete!");
      }, 1000); // Simulate a 1-second network delay
    });
  }

  