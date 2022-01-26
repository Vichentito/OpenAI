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

app.get('/chat', async (req, res) => {
    const openaiKey = process.env.OPENAI_KEY;
    const configuration = new Configuration({
        apiKey: openaiKey,
    });
    const openai = new OpenAIApi(configuration);
    let content_to_classify = "Creo que votare por el PRI";
    const response = await openai.createCompletion("content-filter-alpha", {
        prompt: "<|endoftext|>" + content_to_classify + "\n--\nLabel:",
        temperature: 0,
        max_tokens: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        logprobs: 10
    });
    let output_label = response.data.choices[0].text;

    // This is the probability at which we evaluate that a "2" is likely real
    // vs.should be discarded as a false positive
    let toxic_threshold = -0.355

    if (output_label == "2") {
        // If the model returns "2", return its confidence in 2 or other output - labels
        let logprobs = response.data.choices[0].logprobs.top_logprobs[0];
        // If the model is not sufficiently confident in "2",
        // choose the most probable of "0" or "1"
        // Guaranteed to have a confidence for 2 since this was the selected token.
        if (logprobs["2"] < toxic_threshold) {
            logprob_0 = logprobs.get("0", None)
            logprob_1 = logprobs.get("1", None)
            // If both "0" and "1" have probabilities, set the output label
            // to whichever is most probable
            if (logprob_0 != undefined && logprob_1 != undefined) {
                if (logprob_0 >= logprob_1) {
                    output_label = "0"
                } else {
                    output_label = "1"
                }
                // If only one of them is found, set output label to that one
            } else if (logprob_0 != undefined) {
                output_label = "0"
            } else if (logprob_1 != undefined) {
                output_label = "1"
            }
        }
    }
    // If neither "0" or "1" are available, stick with "2"
    // by leaving output_label unchanged.

    // if the most probable token is none of "0", "1", or "2"
    // this should be set as unsafe
    if (["0", "1", "2"].indexOf(output_label) == -1) {
        output_label = "2"
    }
    // Label Descriptions
    // 0 - The text is safe.
    // 1 - This text is sensitive. This means that the text could be talking about a sensitive topic, something political, religious, 
    // or talking about a protected class such as race or nationality.
    // 2 - This text is unsafe. This means that the text contains profane language, prejudiced or hateful language, 
    // something that could be NSFW, or text that portrays certain groups/people in a harmful manner.
    res.send({
        "output_label": output_label
    })
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

