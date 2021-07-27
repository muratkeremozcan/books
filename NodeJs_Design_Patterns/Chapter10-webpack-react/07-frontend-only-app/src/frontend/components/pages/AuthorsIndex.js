import react from 'react'
import htm from 'htm'
import { Link } from 'react-router-dom'
import { Header } from '../Header.js'
import { authors } from '../../../data/authors.js'

const html = htm.bind(react.createElement)

// Here, we are rendering some markup dynamically based on the list of authors available in our data file. 
// Note that we are using, once again, the Link component from react-router-dom
// to create dynamic links to the author page.
export class AuthorsIndex extends react.Component {
  render () {
    return html`<div>
      <${Header}/>
      <div>${authors.map((author) =>
        html`<div key=${author.id}>
          <p>
            <${Link} to="${`/author/${author.id}`}">${author.name}</>
          </p>
        </div>`)}
      </div>
    </div>`
  }
}
