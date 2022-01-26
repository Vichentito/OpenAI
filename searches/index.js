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
    const response = await openai.createSearch("davinci", {
        documents: ["Caballo", "Manzana", "Miguel Angel", "Universo"],
        query: "Fruta",
    });
    //score above 200 usually means the document is semantically similar to the query
    res.send(response.data);
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

