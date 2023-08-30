const readline = require('readline');
const axios = require('axios');
const { API_CHATGP } = require('./config');
const { CommandRequest } = require('./playmode/commandRequest.js');
const userCommands = require('./playmode/userCommands/index.js')(); // must be invoked because dynamic import
const apiUrl = 'https://api.openai.com/v1/chat/completions';
const {systemMessages} = require('./playmode/systemMessages.js');
const { analyzeInput } = require('./playmode/analyzeInput.js');
const { get } = require('http');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startChat() {
  rl.question('You: ', async (userInput) => {
    //Get Raw Input
    if (userInput.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    //Raw Input to chatGPT for function call
    console.log("Analyzing input");
    let commandRequest = new CommandRequest(userInput);
    commandRequest = await analyzeInput(commandRequest);
    let userConfirmation = await confirmCommand(commandRequest);
    continueCommand(userConfirmation);

    //Call to LLM for narration
    const response = await sendAPIRequest(commandRequest);
    console.log('ChatGPT:', response);
    userConfirmation = await acceptResult(commandRequest);
    continueCommand(userConfirmation);

    //Update State
    console.log('State updated.');
    startChat(); // Continue the conversation
  });
}
function continueCommand(userConfirmation){
  if (!userConfirmation) {
    console.log("Okay, let's try again.");
    startChat(); // Start over if user says "n"
    return;
  }
}
async function confirmCommand(commandRequest) {
  return new Promise((resolve) => {
    const args = commandRequest.args;
    const str = commandRequest.command.getConfirmationMessage(args);
    console.log(str)
    rl.question('Proceed? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        resolve(true);
      } else if (answer.toLowerCase() === 'n') {
        resolve(false);
        process.exit(0);
      } else {
        console.log("Please type 'y' or 'n'");
        resolve(confirmCommand(commandRequest)); // Repeat the prompt
      }
    });
  });
}

const sendAPIRequest = async function (commandRequest) {
  const args = commandRequest.args;
  //should also build the messages argument
  let messages = [];
  messages = messages.concat(systemMessages.voiceNarrator);
  //messages.push(historyMessages); Do this naively as soon as you can
  const prompt = commandRequest.command.buildPrompt(args);
  messages.push({ role: 'user', content: prompt });

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-3.5-turbo', // Use the appropriate model
          messages: messages
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_CHATGP}`
          }
        }
      );
      resolve(response.data.choices[0].message.content);
    } catch (error) {
      reject(error); // Reject the Promise with the error
    }
  });
};

async function acceptResult(commandRequest) {
  return new Promise((resolve) => {
    rl.question('Accept Result? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        resolve(true);
      } else if (answer.toLowerCase() === 'n') {
        resolve(false);
      } else {
        console.log("Please type 'y' or 'n'");
        resolve(acceptResult(commandRequest)); // Repeat the prompt
      }
    });
  });
}

console.log('ChatGPT Terminal App');
console.log('Type "exit" to quit the chat.');

startChat();