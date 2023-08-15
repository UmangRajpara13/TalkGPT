import './App.css'
import React, { useEffect, useState, useRef } from 'react'
import { useAppSelector, useAppDispatch } from './hooks'
import { addMessage,addFormattedMessage } from './slice';
import Conversation from './Components/conversation';

export function App() {
  const [inputValue, setInputValue] = useState('');
  const conversation = useAppSelector((state) => state.converse.conversation)
  const dispatch = useAppDispatch()


  const handleSubmit = async (event) => {
    event.preventDefault();
    setInputValue('');
    dispatch(addMessage({
      role: 'user',
      content: inputValue
    }))
    dispatch(addFormattedMessage({ type: 'p', content: inputValue }))
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    adjustTextareaHeight(event.target);

  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  useEffect(() => {
  }, [])

  const maxRows = 6; // Set the maximum number of rows

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxRows * 22)}px`; // Adjust the row height (usually 22px per row)
  };
  return (
    <div className="container">

      <Conversation />
      <div className='input-box'>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={1}
            style={{ resize: 'none' }}
            className='input-feild'
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter something..."
          />
        </form>
      </div>

    </div>
  )
}
