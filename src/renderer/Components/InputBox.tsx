import './InputBox.css'
import React, { useEffect, useState, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { addInput, addMessage, addFormattedMessage } from '../slice';

function InputBox() {
  const inputValue = useAppSelector((state) => state.converse.inputValue)
  const dispatch = useAppDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(addFormattedMessage({ type: 'text', role: 'user', content: inputValue }))

    dispatch(addMessage({
      role: 'user',
      content: inputValue
    }))


    dispatch(addInput(''))

  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    // console.log(value)
    dispatch(addInput(value))
    adjustTextareaHeight(event.target);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const maxRows = 6; // Set the maximum number of rows

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxRows * 22)}px`; // Adjust the row height (usually 22px per row)
  };
  useEffect(()=>{
    
  })
  return (
    <div className='input'>
      <form onSubmit={handleSubmit} className='input-form'>
        <textarea
          id="input-textarea"
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
  )
}

export default InputBox