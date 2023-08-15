import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { ChatCompletionRequestMessage } from 'openai'



// Define the initial state using that type
const initialState = {
  conversation: [
    { "role": "system", "content": "You are a helpful assistant." },
    { role: "user", content: `hello world` }]
}



const conversation: ChatCompletionRequestMessage[] = [
  { "role": "system", "content": "You are a helpful assistant." }]

export const conversationSlice = createSlice({
  name: 'converse',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: { conversation: conversation },
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addMessage: (state, action: PayloadAction<ChatCompletionRequestMessage>) => {
      state.conversation.push(action.payload)
    },
  },
})

export const { addMessage } = conversationSlice.actions