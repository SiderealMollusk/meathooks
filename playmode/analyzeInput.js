require('dotenv').config();
const API_CHATGP = process.env.API_CHATGP;
const { CommandRequest } = require('./commandRequest');
const axios = require('axios');
const userCommands = require('./userCommands/index.js')(); // must be invoked because dynamic import
const functions = Object.values(userCommands).map(command => command.signature);
const model = 'gpt-3.5-turbo-0613';
const apiUrl = 'https://api.openai.com/v1/chat/completions';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CHATGP}`
};

module.exports = {
    // Makes a function call to the OpenAI API based on available commands
    // This function should return a CommandRequest object
    analyzeInput: async function (commandRequest) {
        const messages = [{ role: 'user', content: commandRequest.originalInput }];
        return axios.post(apiUrl, { model, functions, messages }, { headers })
            .then(response => {
                const choices = response.data.choices[0];
                const functionCall = choices.message.function_call;
                
                if (functionCall) {
                    const functionName = functionCall.name;
                    const functionArguments = JSON.parse(functionCall.arguments);
                    return new CommandRequest(
                        commandRequest.originalInput,
                        userCommands[functionName],
                        functionArguments
                    );
                } else {
                    console.log('No function call detected.');
                    return new CommandRequest(commandRequest.originalInput, 'No function call detected.');
                }
            })
            .catch(error => {
                console.error('Error:', error.message);
                return new CommandRequest(commandRequest.originalInput, 'Error occurred.');
            });
    }
};
