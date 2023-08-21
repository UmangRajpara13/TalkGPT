import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ChatCompletionRequestMessage } from 'openai'


const conversation: ChatCompletionRequestMessage[] = [
  { "role": "system", "content": "You are a helpful assistant." }
]

interface formattedMessage {
  type: 'text' | 'code',
  role: 'system' | 'user' | 'assistant',
  content: string,
  language?: string,
  class?: string
}

export const conversationSlice = createSlice({
  name: 'converse',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: {
    inputValue: '',
    conversation: conversation,
    formattedConversation: [
      { type: 'text', role: "system", content: "You are a helpful assistant.", class: "non-user-message" }
    ]
  },
  reducers: {
    addInput: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload
    },
    appendInput: (state, action: PayloadAction<string>) => {
      state.inputValue += action.payload
    },
    addMessage: (state, action: PayloadAction<ChatCompletionRequestMessage>) => {
      state.conversation.push(action.payload)
    },
    addFormattedMessage: (state, action: PayloadAction<formattedMessage>) => {
      const message = {
        type: action.payload.type,
        role: action.payload.role,
        content: '',
        class: '',
        language: ''
      }
      if (action.payload.role === 'user') {
        message.class = "user-message"
      }
      if (action.payload.role === 'assistant' || action.payload.role === 'system') {
        message.class = "non-user-message"
      }

      message.content = action.payload.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

      if (action.payload.type === 'text') {
        message.content = message.content.replace(/`([^`]+)`/g, (match, code) => {
          return '<code>' + code + '</code>';
        });
      }
      state.formattedConversation.push(message)
    },
  },
})

export const { addInput, appendInput, addMessage, addFormattedMessage } = conversationSlice.actions