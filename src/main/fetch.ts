import { ipcMain } from "electron";
import { ChatCompletionRequestMessage } from 'openai'
import axios from 'axios';
import { window } from './main';


const conversation: ChatCompletionRequestMessage[] = [
    { role: "system", content: "You are a helpful assistant." }
]

ipcMain.on('fetch', async (event, data) => {
    console.log('fetching',data)
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

                            if (element != ' [DONE]') {
                                const obj = JSON.parse(element)
                                // process.stdout.write(obj.choices[0].finish_reason,obj.choices[0].delta.content)
                                if (obj.choices[0].finish_reason != 'stop') {
                                    const content = obj.choices[0].delta.content
                                    window.webContents.send('fetchResponse', content)
                                }
                            }
                        } catch (error) {
                            window.webContents.send('mainError', JSON.stringify({
                                comment: 'parse error',
                                error: error,
                                errorNumber: 0,
                                errorCode: 'open dev tools'
                            }))
                        }
                    }
                });
            })
        } catch (error) {
            // console.log('on data error', error)
            // console.log(error.errno, error.code)
            window.webContents.send('mainError', JSON.stringify({
                comment: 'on data error',
                error: error,
                errorNumber: 0,
                errorCode: 'open dev tools'
            }))

        }

    } catch (error) {
        // console.log(error)
        // console.log(error.errno, error.code)
        window.webContents.send('mainError', JSON.stringify({
            comment: 'axios post error',
            error: error,
            errorNumber: error?.errno,
            errorCode: error?.code
        }))

    }
})
