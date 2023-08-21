import './App.css'
import 'highlight.js/styles/github-dark.css';

import React, { useEffect, useState, useRef } from 'react'
import { useAppDispatch } from './hooks'
import { appendInput } from './slice';
import Conversation from './Components/conversation';
import { ipcRenderer } from 'electron';
import InputBox from './Components/InputBox';
import Titlebar from './Components/Titlebar';

export function App() {

  const dispatch = useAppDispatch()

  useEffect(() => {

    const textarea = document.getElementById("input-textarea")
    var isTextareaFocused = false
    textarea.addEventListener('focus', (event) => {
      console.log('focus')
      isTextareaFocused = true
    });
    textarea.addEventListener('blur', (event) => {
      console.log('blur')
      isTextareaFocused = false
    })
    ipcRenderer.on('transcription', (event, data) => {
      console.log(data)
      isTextareaFocused && dispatch(appendInput(data))
    })
  }, [])


  return (
    <div className="container">
      <Titlebar />
      <Conversation />
      <InputBox />


    </div>
  )
}
