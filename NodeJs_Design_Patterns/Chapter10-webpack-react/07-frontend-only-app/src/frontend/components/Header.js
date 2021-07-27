import react from 'react'
import htm from 'htm'
import { Link } from 'react-router-dom'

const html = htm.bind(react.createElement)

// the title is wrapped by a Link component from the react-router-dom library.
// This component is responsible for rendering a clickable link that can interact with the application router 
// to switch to a new route dynamically, without refreshing the entire page
export class Header extends react.Component {
  render () {
    return html`<header>
      <h1>
        <${Link} to="/">My library</>
      </h1>
    </header>`
  }
}
