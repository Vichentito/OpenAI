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
app.use(cors());
//import dotenv
require("dotenv").config();
app.get('/chat', async (req, res) => {
    //get openaiKey from .env
    const openaiKey = process.env.OPENAI_KEY;
    const configuration = new Configuration({
        apiKey: openaiKey,
    });
    const openai = new OpenAIApi(configuration);
    const engines = await openai.listEngines();
    const response = await openai.createAnswer({
        //ID of the engine to use for Search.
        search_model: "ada",
        //ID of the engine to use for completion
        model: "curie",
        question: "which puppy is happy?", //Question to get answered.
        documents: ["Puppy A is happy.", "Puppy B is sad."],
        //A text snippet containing the contextual information used to generate the answers for the examples you provide.
        examples_context: "In 2017, U.S. life expectancy was 78.6 years.",
        //List of (question, answer) pairs that will help steer the model towards the tone and answer format you'd like. We recommend adding 2 to 3 examples.
        examples: [["What is human life expectancy in the United States?", "78 years."]],
        max_tokens: 5,
        stop: ["\n", "<|endoftext|>"],
    });
    //score above 200 usually means the document is semantically similar to the query
    res.send({
        response: response.data,
        engines: engines.data
    })
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

