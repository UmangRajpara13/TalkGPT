import './conversation.css'
import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { Configuration, OpenAIApi } from "openai";
import { addMessage, addFormattedMessage, appendLastMessage } from '../slice';
import axios from 'axios';
import hljs from 'highlight.js';
import { ipcRenderer } from 'electron';

const configuration = new Configuration({
    // organization: "",
    apiKey: process.env.OPENAI_API_KEY,
});
// console.log(process.env.OPENAI_API_KEY)
const openai = new OpenAIApi(configuration);

function Conversation() {
    const conversation = useAppSelector((state) => state.converse.conversation)
    const formattedConversation = useAppSelector((state) => state.converse.formattedConversation)
    const dispatch = useAppDispatch()

    useEffect(() => {
        // ipcRenderer.on('fetchResponse', (event, data) => {
        //     // console.log(data)
        //     console.log(conversation)
        //     // dispatch(addMessage(JSON.parse(data)))

        //     // dispatch(appendLastMessage(JSON.parse(data)))


        //     var received = ''
        //     var codeIncoming = false



        //     // if (data.includes('`')) {
        //     //   for (let i = 0; i < 2; i++) {
        //     //     received += data
        //     //   }
        //     //   if (received.includes('```')) {
        //     //     const textCodeSplit = received.split('```')
        //     //     if (!codeIncoming) {
        //     //       // dispatch(appendLastMessage(JSON.parse(data)))

        //     //       // window.webContents.send('fetchResponse', JSON.stringify({ type: 'text', role: 'assistant', content: textCodeSplit[0] }))
        //     //       // window.webContents.send('fetchResponse', JSON.stringify({ type: 'code', role: 'assistant', content: textCodeSplit[1] }))


        //     //       // text += textCodeSplit[0]
        //     //       // code += textCodeSplit[1]
        //     //       codeIncoming = true
        //     //     } else {
        //     //       // window.webContents.send('fetchResponse', JSON.stringify({ type: 'text', role: 'assistant', content: textCodeSplit[1] }))
        //     //       // window.webContents.send('fetchResponse', JSON.stringify({ type: 'code', role: 'assistant', content: textCodeSplit[0] }))

        //     //       // code += textCodeSplit[0]
        //     //       // text += textCodeSplit[1]
        //     //       codeIncoming = false
        //     //     }
        //     //     received = ''
        //     //   }
        //     // } else {
        //     //   if (!codeIncoming) {
        //     //     // text += received
        //     //     received += data

        //     //     // window.webContents.send('fetchResponse', JSON.stringify({ type: 'text', role: 'assistant', content: received }))

        //     //     received = ''
        //     //   } else {
        //     //     // code += received
        //     //     received += data

        //     //     // window.webContents.send('fetchResponse', JSON.stringify({ type: 'code', role: 'assistant', content: received }))

        //     //     received = ''
        //     //   }
        //     // }
        //   })

        const fetchData = async () => {
            ipcRenderer.send('fetch', JSON.stringify(conversation))
        };

        const lastMessage = conversation[conversation.length - 1];

        if (lastMessage.role == 'user') fetchData();
        // console.log(formattedConversation)
        // Manually trigger syntax highlighting after component mounts
        hljs.highlightAll();
    }, [formattedConversation])

    const handleCopyClick = (content) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Code block copied to clipboard');
        }).catch((error) => {
            console.error('Failed to copy code block:', error);
        });
    };

    return (
        <div className='conversation'>
            {formattedConversation.map((message, index) =>
            (<React.Fragment key={index}>
                {message.type === 'code' ? (
                    <div className={message.class}>
                        <div className='code-titlebar'>
                            <span className='code-title'>
                                {message.content.split('\n')[0]}
                            </span>
                            <button className="copy-button" onClick={() => handleCopyClick(message.content.split('\n').slice(1).join('\n'))}>
                                Copy
                            </button>
                        </div>
                        <div>
                            <pre>
                                <code className={message.language ? `hljs language-${message.language}` : ``}
                                    dangerouslySetInnerHTML={{ __html: message.content.split('\n').slice(1).join('\n').replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
                            </pre>
                        </div>
                    </div>
                ) : (
                    <div className={message.class}>
                        <p dangerouslySetInnerHTML={{ __html: message.content }} />
                    </div>

                )}
            </React.Fragment>)
            )}
        </div>
    )
}

export default Conversation