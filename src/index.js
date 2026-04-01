import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { BrowserRouter } from 'react-router-dom'
// import { Web3ReactProvider } from '@web3-react/core'
import { Web3ReactManager } from './utils/Web3ReactManager'
import { getLibrary } from './utils'
import './index.scss'
import './tailwind.css'
import { Provider } from 'react-redux'
import store from './state'
import { ethers } from "ethers";
import { ThemeProvider } from './components/common/ThemeToggleButton/ThemeContext'


// const getLibrary = provider => {
//   const library = new ethers.providers.Web3Provider(provider);
//   library.pollingInterval = 8000; // frequency provider is polling
//   return library;
// };

ReactDOM.render(
  <React.StrictMode>
{/*<Web3ReactProvider getLibrary={getLibrary}>*/}
      <Web3ReactManager>
        <BrowserRouter>
          <Provider store={store}>
              <ThemeProvider>
                  <App />
              </ThemeProvider>
          </Provider>
        </BrowserRouter>
      </Web3ReactManager>
{/*</Web3ReactProvider>*/}
  </React.StrictMode>,
  document.getElementById('root'),
)
