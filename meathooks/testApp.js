import EasyGPT from "easygpt";

/*
    Creating an instance of EasyGpt with false as the first paramater,
    means that when you run ```instance.ask();``` the messages will be cleared 
    and ChatGPT's response will not be saved.
*/
const gpt = new EasyGpt(false);

// Set your OpenAI API key.
gpt.setApiKey("<YOUR API KEY HERE>");

// Add a prompt you would like to say to ChatGPT.
gpt.addMessage("Hello ChatGPT! My name is Adam!");

// ChatGPT API response.
// The reason for "let" is that we will be reusing response later.
let response = await gpt.ask();

// Print ChatGPT's response to the console!
console.log(response.content);

// EXAMPLE OUTPUT
// ! Hello Adam! It's nice to meet you. How can I assist you today?

// Add an aditional message to the stack.
gpt.addMessage("What was my name again?");

// ChatGPT API response.
response = await gpt.ask();

// Print ChatGPT's response to the console!
console.log(response.content);
