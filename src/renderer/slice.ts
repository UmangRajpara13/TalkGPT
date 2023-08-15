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
    conversation: conversation,
    formattedConversation: [{ "type": "p", "content": "You are a helpful assistant." }]
  },
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addMessage: (state, action: PayloadAction<ChatCompletionRequestMessage>) => {
      state.conversation.push(action.payload)
    },
    addFormattedMessage: (state, action: PayloadAction<formattedMessage>) => {
      state.formattedConversation.push(action.payload)
    },
  },
})

export const { addMessage, addFormattedMessage } = conversationSlice.actions