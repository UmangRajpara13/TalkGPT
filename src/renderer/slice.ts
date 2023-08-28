import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ChatCompletionRequestMessage } from 'openai'


const conversation: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content: `You are a helpful assistant.`,
  }
]

interface formattedMessage {
  type: 'text' | 'code' | 'error',
  role?: 'system' | 'user' | 'assistant',
  content?: string,
  language?: string,
  class?: string,
  errorNumber?: number,
  errorCode?: string
}

export const conversationSlice = createSlice({
  name: 'converse',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: {
    inputValue: '',
    conversation: conversation,
    formattedConversation: [
      {
        type: 'text', role: "system",
        content: `You are a helpful assistant.`,
        class: "non-user-message",
        language: ''
      }
    ] as formattedMessage[]
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
        class: ''
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
    appendLastMessage: (state, action: PayloadAction<formattedMessage>) => {
      console.log(action.payload)
      // console.log(getLastFormattedMessageRole(state))
      if (action.payload.role === getLastFormattedMessageRole(state)) {
        const message = {
          type: action.payload.type,
          role: action.payload.role,
          class: action.payload.class,
          language: action.payload.language ? action.payload.language : ''
        }

        state.conversation = [
          ...state.conversation.slice(0, -1),
          { role: message.role, content: getLastMessageContent(state) + action.payload.content }
        ]

        // console.log(action.payload.type, getLastFormattedMessageType(state))

        console.log(printLastFormattedMessage(state))

        if (action.payload.type === getLastFormattedMessageType(state)) {
          state.formattedConversation = [
            ...state.formattedConversation.slice(0, -1),
            {
              ...message,
              content: getLastFormattedMessageContent(state) + action.payload.content,
            }
          ]
        } else {
          state.formattedConversation.push({
            ...message,
            content: action.payload.content,
          })
        }
      } else {
        const message = {
          type: action.payload.type,
          role: action.payload.role,
          content: action.payload.content,
          class: ''
        }
        state.conversation.push({ role: message.role, content: message.content })
        state.formattedConversation.push(message)
      }
    },
    addErrorMessage: (state, action: PayloadAction<formattedMessage>) => {
      state.formattedConversation.push(action.payload)
    },
    removeErrorMessage: (state, action: PayloadAction<formattedMessage>) => {
      state.formattedConversation = state.formattedConversation.filter(ele => ele.type !== 'error')
      // printFormattedMessages(state)
    }
  }
})

const getLastMessageContent = (state) => {
  const lastObject = state.conversation.slice(-1)[0];
  return lastObject ? lastObject.content : null;
};
const getLastFormattedMessageRole = (state) => {
  const lastObject = state.formattedConversation.slice(-1)[0];
  return lastObject ? lastObject.role : null;
};
const getLastFormattedMessageContent = (state) => {
  const lastObject = state.formattedConversation.slice(-1)[0];
  return lastObject ? lastObject.content : null;
};
const getLastFormattedMessageType = (state) => {
  const lastObject = state.formattedConversation.slice(-1)[0];
  return lastObject ? lastObject.type : null;
};
const printLastFormattedMessage = (state) => {
  // console.log(state.formattedConversation[-1])
  const lastObject = state.formattedConversation.slice(-1)[0];
  return lastObject ? { role: lastObject.role, content: lastObject.content, type: lastObject.type } : null;
};
// const printFormattedMessages = (state) => {
//   const lastObject = state.formattedConversation
//   console.log(lastObject)
// };
export const { addInput, appendInput, removeErrorMessage, appendLastMessage, addErrorMessage, addMessage, addFormattedMessage } = conversationSlice.actions;