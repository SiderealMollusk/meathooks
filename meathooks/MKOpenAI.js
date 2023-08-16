require('dotenv').config();
const axios = require('axios'); // You might need to install axios using npm or yarn

const apiKey = process.env.API_CHATGP;
const Generate = async function (prompt) {
    Prompt(prompt);
}
const Prompt = async function (prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Use the appropriate model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.' // Initial system message
          },
          {
            role: 'user',
            content: prompt // User message or prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    // Log the response for debugging purposes
    console.log('OpenAI Response:', response.data.choices[0].message.content);

    // Extract the generated message from the response
    const generatedMessage = response.data.choices[0].message.content;
    return generatedMessage;
  } catch (error) {
    console.error('Error generating text:', error);
    return null;
  }
};

module.exports = { Generate };
