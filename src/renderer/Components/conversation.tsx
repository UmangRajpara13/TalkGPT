import './conversation.css'
import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { Configuration, OpenAIApi } from "openai";
import { addMessage, addFormattedMessage } from '../slice';
import hljs from 'highlight.js';

const configuration = new Configuration({
    // organization: "",
    apiKey: process.env.OPENAI_API_KEY,
});
console.log(process.env.OPENAI_API_KEY)
const openai = new OpenAIApi(configuration);

function Conversation() {
    const conversation = useAppSelector((state) => state.converse.conversation)
    const formattedConversation = useAppSelector((state) => state.converse.formattedConversation)
    const dispatch = useAppDispatch()

    useEffect(() => {

        const fetchData = async () => {
            try {
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: conversation
                });

                console.log(completion.data.choices[0].message);
                const message = completion.data.choices[0].message
                dispatch(addMessage(message))

                const sourceCodePattern = /```([\s\S]*?)```/g;

                const parts = message.content.split(/```/g);
                console.log(parts)
                const matches = message.content.match(sourceCodePattern);
                console.log(matches)

                parts.map((part, index) => {
                    // console.log(part,matches[index])

                    const searchString = "```" + part + "```";

                    if (matches && matches.includes(searchString)) {
                        console.log('// its a code')
                        dispatch(addFormattedMessage({ type: 'code', role: 'assistant', content: part }))

                    } else {
                        console.log('// its text')
                        dispatch(addFormattedMessage({ type: 'text', role: 'assistant', content: part }))
                    }
                })

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const lastMessage = conversation[conversation.length - 1];

        if (lastMessage.role == 'user') fetchData();
        console.log(formattedConversation)
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
                                <code className="hljs"
                                    dangerouslySetInnerHTML={{ __html: message.content.split('\n').slice(1).join('\n') }} />
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