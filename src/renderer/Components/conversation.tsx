import './conversation.css'
import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { Configuration, OpenAIApi } from "openai";
import { addMessage, addFormattedMessage, appendLastMessage, removeErrorMessage } from '../slice';
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
    const retry = () => {
        dispatch(removeErrorMessage())
        ipcRenderer.send('fetch', JSON.stringify(conversation))
    }
    return (
        <div className='conversation'>
            {formattedConversation.map((message, index, array) =>
            (<React.Fragment key={index}>
                {(message.type === 'code' || message.type === 'text') ?
                    message.type === 'code' ? (

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
                                    <code className={message.language ? `hljs language-${message.language}` : ``}>
                                        {message.content.split('\n').slice(1).join('\n').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className={message.class}>
                            <p >{message.content}</p>
                        </div>

                    ) :
                    <div className={message.class}>
                        <span>{message.errorNumber}</span>
                        <span>   {message.errorCode}</span>
                        <button className="retry-button" onClick={() => retry()}>
                            Try Again
                        </button>
                    </div>
                }
            </React.Fragment>)
            )}
        </div>
    )
}

export default Conversation