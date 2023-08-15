import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { Configuration, OpenAIApi } from "openai";
import { addMessage, addFormattedMessage } from '../slice';
import hljs from 'highlight.js';

const configuration = new Configuration({
    // organization: "",
    // apiKey: remote.process.env.REACT_APP_OPENAI_API_KEY,
    apiKey: "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",
});
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
                        dispatch(addFormattedMessage({ type: 'code', content: part }))

                    } else {
                        console.log('// its text')
                        dispatch(addFormattedMessage({ type: 'p', content: part }))

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
            {/* {conversation.map((value, index) => (
                <div key={index}>{value.content}</div>
            ))} */}
            {formattedConversation.map((value, index) =>
            (
                <React.Fragment key={index}>
                    {value.type === 'code' ? (<div>
                        <button className="copy-button" onClick={() => handleCopyClick(value.content)}>Copy</button>
                        <pre><code className="hljs" dangerouslySetInnerHTML={{ __html: value.content }} /></pre>
                    </div>
                    ) : (
                        <p dangerouslySetInnerHTML={{ __html: value.content }} />
                    )}
                </React.Fragment>
            )
            )}
        </div>
    )
}

export default Conversation