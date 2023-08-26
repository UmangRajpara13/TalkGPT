import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, stream: true,
});

const openai = new OpenAIApi(configuration);

// async function Stream() {

//     const params = {
//         model: 'gpt-3.5-turbo',
//         messages: [{ "role": "system", "content": "You are a helpful assistant." },
//         { "role": "user", "content": "js to print hi" }
//         ],
//         max_tokens: 200,
//         temperature: 0,
//         stream: true,
//     };

//     const response = await axios.post('https://api.openai.com/v1/chat/completions', params, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//         responseType: 'stream',
//     });

//     response.data.on('data', chunk => {

//         const bytesString = chunk.toString('utf-8');

//         bytesString.split('\n').forEach(element => {
//             if (element.length != 0) {
//                 try {
//                     element = element.replace(/(\n)$/, '').substring(5)

//                     // console.log(element)
//                     if (element.trim() != '[DONE]') {
//                         const obj = JSON.parse(element)
//                         // process.stdout.write(obj.choices[0].delta.content)
//                         console.log(obj.choices[0].delta.content)
//                     }
//                 } catch (error) {
//                     console.log(error)
//                 }
//             }
//         });
//     });
// }

// Stream()

function fetchStream() {

    const params = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'js to print hi' }
        ],
        // stream: true
    };

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
    })
        .then(response => {
            const reader = response.body.getReader();

            // Reading chunks of data as they arrive
            function read() {
                return reader.read().then(({ done, value }) => {
                    if (done) {
                        console.log('End of stream');
                        return;
                    }

                    const bytesString = new TextDecoder('utf-8').decode(value);
                    console.log(bytesString)
                    // bytesString.split('\n').forEach(element => {
                    //     if (element.length !== 0) {
                    //         try {
                    //             element = element.replace(/(\n)$/, '').substring(5);

                    //             // if (element.trim() !== '[DONE]') {
                    //             //     const obj = JSON.parse(element);
                    //             //     console.log(obj.choices[0].delta.content);
                    //             // }
                    //         } catch (error) {
                    //             console.log(error);
                    //         }
                    //     }
                    // });

                    // Read the next chunk
                    return read();
                });
            }

            return read();
        })
        .catch(error => {
            console.error('An error occurred while streaming:', error);
        });

}
fetchStream()