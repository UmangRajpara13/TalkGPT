import './App.css'
import 'highlight.js/styles/github-dark.css';

import React, { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { addErrorMessage, addMessage, appendInput, appendLastMessage } from './slice';
import Conversation from './Components/conversation';
import { ipcRenderer } from 'electron';
import InputBox from './Components/InputBox';
import Titlebar from './Components/Titlebar';

export function App() {
  const formattedConversation = useAppSelector((state) => state.converse.formattedConversation)

  const dispatch = useAppDispatch()


  useEffect(() => {

    const textarea = document.getElementById("input-textarea")
    var isTextareaFocused = false
    textarea.addEventListener('focus', (event) => {
      // console.log('focus')
      isTextareaFocused = true
    });
    textarea.addEventListener('blur', (event) => {
      // console.log('blur')
      isTextareaFocused = false
    })
    ipcRenderer.on('transcription', (event, data) => {
      // console.log(data)
      isTextareaFocused && dispatch(appendInput(data))
    })
    ipcRenderer.on('error', (event, data) => {
      // console.log('error', data)
    })
    ipcRenderer.on('state', (event, data) => {
      // console.log('window isFocused', data)
      if (data) textarea.focus()

    })


    var received = ''
    var codeIncoming = false
    var i = 0
    var codeIncomingPossible = false

    const checkReceived = (snippet) => {
      return new Promise<void>(async (resolve, reject) => {
        if (snippet.includes('```')) {

          const textCodeSplit = snippet.split('```')
          console.log(snippet.split('```'))

          if (!codeIncoming) {
            dispatch(appendLastMessage({ type: 'text', role: 'assistant', content: textCodeSplit[0], class: "non-user-message" }))
            dispatch(appendLastMessage({
              type: 'code', language: textCodeSplit[1],
              role: 'assistant', content: textCodeSplit[1], class: "non-user-message"
            }))

            codeIncoming = true
          } else {
            dispatch(appendLastMessage({ type: 'code', role: 'assistant', content: textCodeSplit[0], class: "non-user-message" }))
            dispatch(appendLastMessage({ type: 'text', role: 'assistant', content: textCodeSplit[1], class: "non-user-message" }))

            codeIncoming = false
          }
        } else {
          dispatch(appendLastMessage({ type: 'text', role: 'assistant', content: snippet, class: "non-user-message" }))
        }
        resolve()
      })
    }

    ipcRenderer.on('fetchResponse', async (event, data) => {

      if (codeIncomingPossible) {
        i += 1;
        received += data
        if (i < 2) return
        else {
          i = 0;
          codeIncomingPossible = false;
          await checkReceived(received);
          received = '';
          return;
        }
      }

      if (data.includes('`')) {
        codeIncomingPossible = true
        received += data
        return;
      } else {
        if (!codeIncoming) {
          // console.log('! codeIncoming', data)
          dispatch(appendLastMessage({ type: 'text', role: 'assistant', content: data, class: "non-user-message" }))
        } else {
          // console.log('codeIncoming', data)

          dispatch(appendLastMessage({ type: 'code', role: 'assistant', content: data, class: "non-user-message" }))
        }
      }
    })

    ipcRenderer.on('mainError', (event, error) => {
      console.log(JSON.parse(error))
      dispatch(addErrorMessage({ type: 'error', errorCode: JSON.parse(error)?.errorCode, errorNumber: JSON.parse(error)?.errorNumber, class: "error-message" }))

    })
  }, [])


  return (
    <div className="app">
      <Titlebar />

      <Conversation />

      <InputBox />


    </div>
  )
}
