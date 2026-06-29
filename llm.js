const OpenAI = require('openai')

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function askLLM(userText){
    const response = await client.chat.completions.create({
        model: 'gpt-5.5',
        messages:[
            { role: 'user', content: userText }
        ]
    });

    return response.choices[0].message.content;
}

module.exports = {
    askLLM
};