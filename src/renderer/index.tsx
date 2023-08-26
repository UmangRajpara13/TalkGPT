import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import store from './store'
import { Provider } from 'react-redux'


// Mount the app using createRoot
createRoot(document.getElementById('root')).render(<Provider store={store}>
  <App />
</Provider>
);


// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>
//   ,
//   document.getElementById('root')
// );