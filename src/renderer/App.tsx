import React, { useEffect, useState,useRef } from 'react'
import { useAppSelector, useAppDispatch } from './hooks'
import { increment } from './slice';


export function App() {
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState([]);
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()


  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the input value, like sending it to a server
    console.log('Submitted value:', inputValue);
    setConversation([...conversation, inputValue]);
    setInputValue('');

  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
     // Calculate the number of lines in the input value
    //  const lineCount = value.split('\n').length;
// console.log(lineCount)
     // Set the rows dynamically based on line count (limited to 3 rows)
    //  event.target.rows = Math.min(lineCount, 3);
    adjustTextareaHeight(event.target);

  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  setTimeout(()=>{
    dispatch(increment())
   },1000)
  
  useEffect(() => { 
 
  

     return    
  }, [])   

  const maxRows = 6; // Set the maximum number of rows

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxRows * 22)}px`; // Adjust the row height (usually 22px per row)
  };
  return (
    <div className="container">
<div>{count}</div>
      <div className='conversation'>
        {conversation.map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </div>

      <div  className='input-box'>
        <form onSubmit={handleSubmit}>
      <textarea
        rows={1}
        // ref={textareaRef}
        style={{ resize: 'none' }}

        // rows={calculateRows(inputValue)}

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
 