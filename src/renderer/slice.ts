import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { ChatCompletionRequestMessage } from 'openai'


const conversation: ChatCompletionRequestMessage[] = [
  { "role": "system", "content": "You are a helpful assistant." }]

interface formattedMessage {
  type: 'p' | 'code',
  content: string
}

export const conversationSlice = createSlice({
  name: 'converse',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: {
    inputValue: '',
    conversation: conversation,
    formattedConversation: [{ "type": "p", "content": "You are a helpful assistant." }]
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
      state.formattedConversation.push(action.payload)
    },
  },
})

export const { addInput, appendInput, addMessage, addFormattedMessage } = conversationSlice.actions