//import openai
const { Configuration, OpenAIApi } = require("openai");
//create express server and set port 3000
const express = require('express');
const app = express();
const port = 3000;
//set up json parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
//set up cors
const cors = require('cors');
//import dotenv
require("dotenv").config();
//create route named chat
const start_sequence = "\nJose:"
const restart_sequence = "\n\nPerson:"
const session_prompt = "Hola que tal estas hablando con Jose, tu asistente presonal.Person:"

app.get('/chat', async (req, res) => {
    let incoming_msg = req.body.message
    let chat_log = req.body.chat_log
    console.log(chat_log);
    let answer = await ask(incoming_msg, chat_log)
    chat_log = append_interaction_to_chat_log(incoming_msg, answer, chat_log)
    res.send({
        answer: answer,
        chat_log: chat_log
    })
});
ask = async (question, chat_log) => {
    const openaiKey = process.env.OPENAI_KEY;
    const configuration = new Configuration({
        apiKey: openaiKey,
    });
    const openai = new OpenAIApi(configuration);
    let prompt_text = `${chat_log}${restart_sequence}: ${question}${start_sequence}:`
    console.log(prompt_text);
    const response = await openai.createCompletion("text-davinci-001", {
        prompt: prompt_text,
        temperature: 0.8,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["\n"],
    });
    story = response.data.choices[0].text
    return story
}

append_interaction_to_chat_log = (question, answer, chat_log) => {
    if (chat_log == undefined)
        chat_log = session_prompt
    return `${chat_log}${restart_sequence} ${question}${start_sequence}${answer}`
}
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

