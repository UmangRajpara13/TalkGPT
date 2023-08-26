import { ipcMain } from "electron";
import { ChatCompletionRequestMessage } from 'openai'
import axios from 'axios';
import { window } from './main';


const conversation: ChatCompletionRequestMessage[] = [
    { role: "system", content: "You are a helpful assistant." }
]

ipcMain.on('fetch', async (event, data) => {
    console.log(JSON.parse(data))
    // conversation.push(JSON.parse(data))
    try {
        const params = {
            model: 'gpt-3.5-turbo',
            messages: JSON.parse(data),
            stream: true,
        };
        const response = await axios.post('https://api.openai.com/v1/chat/completions', params, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            responseType: 'stream',
        });       
        try {
            // console.log(response)
            response.data.on('data', chunk => {
                const bytesString = chunk.toString('utf-8');
    
                bytesString.split('\n').forEach(element => {
                    if (element.length != 0) {
                        try {
                            element = element.substring(5)
                            // console.log(element)

                            if (element.trim() != '[DONE]') {
                                const obj = JSON.parse(element)
                                process.stdout.write(obj.choices[0].delta.content)
                                const content = obj.choices[0].delta.content
                                window.webContents.send('fetchResponse', content)

                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                });
            });
        } catch (error) {
            console.log(error)
    
    
        }
 
    } catch (error) {
        console.log(error)

    }
 

 
})
