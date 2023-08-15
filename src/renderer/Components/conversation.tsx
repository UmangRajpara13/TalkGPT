import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { Configuration, OpenAIApi } from "openai";
import { addMessage } from '../slice';

const configuration = new Configuration({
    // organization: "",
    // apiKey: remote.process.env.REACT_APP_OPENAI_API_KEY,
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

function Conversation() {
    const conversation = useAppSelector((state) => state.converse.conversation)
    const dispatch = useAppDispatch()

    useEffect(() => {

        const fetchData = async () => {
            try {
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: conversation
                });

                console.log(completion.data.choices[0].message);
                dispatch(addMessage(completion.data.choices[0].message))
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const lastMessage = conversation[conversation.length - 1];

        if (lastMessage.role == 'user') fetchData();

    }, [conversation])
    return (
        <div className='conversation'>
            {conversation.map((value, index) => (
                <div key={index}>{value.content}</div>
            ))}
        </div>
    )
}

export default Conversation