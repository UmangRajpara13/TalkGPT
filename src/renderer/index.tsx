import 'highlight.js/styles/default.css';

import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import ReactDOM from 'react-dom';
import store from './store'
import { Provider } from 'react-redux'

// const root = createRoot(document.getElementById('root')!)

// root.render(<App />)


ReactDOM.render( 
    <Provider store={store}>
      <App /> 
    </Provider>
    ,
    document.getElementById('root')
  );