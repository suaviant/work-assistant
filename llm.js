const {AzureOpenAI} = require('openai')

const client = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION
});

async function askLLM(userText){

    const sysPrompt = `You are a desktop task assistant. 
    The user is answering a question "What would you like to do?"

    The context is the user has tasks they want to accomplish using the computer they are accessing you from.
    Return a step-by-step list that breaks the task into easy-to-focus, easy-to-accomplish chunks.
    
    Return valid JSON only.
    
    The JSON must match this shape:
    
    {
        "goal": "string",
        "steps": [
            {
                "title":"string",
                "detailed_instruction":"string",
            }
        ]
    }
        
    Rules:
        - Do not use markdown
        - Do not wrap teh JSON in backticks.
        - Do not include comments.
        - Keep each step short and action-oriented.`;

    const response = await client.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT,
        messages:[
            { role: 'system', content: sysPrompt},
            { role: 'user', content: userText }
        ]
    });

    replyText = response.choices[0].message.content;
    let parsed;

    try{
        parsed = JSON.parse(replyText);
    } catch (error){
        console.error('Invalid JSON:', error);
        return null;
    }

    return parsed;
}

module.exports = {
    askLLM
};