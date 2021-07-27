import react from 'react'
import reactDOM from 'react-dom'
import htm from 'htm'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App.js'

const html = htm.bind(react.createElement)

/*
we are importing the App component and attaching it to the DOM in an element with the ID equal to root. 
The only detail that stands out is that we are wrapping the application into a BrowserRouter component. 
This component comes from the react-router-dom library and it provides our app with client-side routing capabilities.
*/
reactDOM.render(
  html`<${BrowserRouter}><${App}/></>`,
  document.getElementById('root')
)
