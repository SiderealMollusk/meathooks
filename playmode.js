const readline = require('readline');
const axios = require('axios');
const { API_CHATGP } = require('./config');
const { CommandRequest } = require('./playmode/commandRequest.js');
const userCommands = require('./playmode/userCommands/index.js')(); // must be invoked because dynamic import
const apiUrl = 'https://api.openai.com/v1/chat/completions';
const { analyzeInput } = require('./playmode/analyzeInput.js');
const { get } = require('http');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startChat() {
  rl.question('You: ', async (userInput) => {
    if (userInput.toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    let commandRequest = new CommandRequest(userInput);
    console.log("Analyzing input");
    commandRequest = await analyzeInput(commandRequest);
    const userConfirmation = await getConfirmation(commandRequest);
    if (!userConfirmation) {
      console.log("Okay, let's try again.");
      startChat(); // Start over if user says "n"
      return;
    }

    const response = await sendAPIRequest(commandRequest);

    console.log('ChatGPT:', response);

    startChat(); // Continue the conversation
  });
}

async function getConfirmation(commandRequest) {
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
        resolve(getConfirmation(commandRequest)); // Repeat the prompt
      }
    });
  });
}

const sendAPIRequest = async function (commandRequest) {
  const args = commandRequest.args;
  const prompt = commandRequest.command.buildPrompt(args);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-3.5-turbo', // Use the appropriate model
          messages: [
            {
              role: 'user',
              content: prompt // User message or prompt
            }
          ]
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

console.log('ChatGPT Terminal App');
console.log('Type "exit" to quit the chat.');

startChat();