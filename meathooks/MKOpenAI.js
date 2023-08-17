require('dotenv').config();
const axios = require('axios'); // You might need to install axios using npm or yarn
const apiKey = process.env.API_CHATGP;
const Generate = async function (prompt) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo', // Use the appropriate model
            messages: [
              {
                role: 'system',
                content: 'You can only reply with well formated json' // Initial system message
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
        let mkResponse = response.data.choices[0];
        resolve(response.data); // Resolve the Promise with the generated message
      } catch (error) {
        reject(error); // Reject the Promise with the error
      }
    });
  };

module.exports = { Generate };
