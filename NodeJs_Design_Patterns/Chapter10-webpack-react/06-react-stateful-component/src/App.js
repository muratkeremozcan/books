import react from 'react'
import htm from 'htm'
import { RecentGithubProjects } from './RecentGithubProjects.js'

const html = htm.bind(react.createElement)

export class App extends react.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: 'javascript',
      label: 'JavaScript'
    }
    // we are explicitly binding the setQuery() function to the current component instance. 
    // The reason why we do this is because this function is used directly as an event handler for the click event. 
    // In this case, the reference to this would be undefined without the bind and it would not be possible to call this.setState() from the handler.
    this.setQuery = this.setQuery.bind(this)
  }

  setQuery (e) {
    e.preventDefault()
    const label = e.currentTarget.text
    this.setState({ label, query: label.toLowerCase() })
  }

  render () {
    return html`<div>
      <nav>
        <a href="#" onClick=${this.setQuery}>JavaScript</a>
        ${' '}
        <a href="#" onClick=${this.setQuery}>Node.js</a>
        ${' '}
        <a href="#" onClick=${this.setQuery}>React</a>
      </nav>
      <h1>Recently updated ${this.state.label} projects</h1>
      <${RecentGithubProjects} query=${this.state.query}/>
    </div>`
  }
}
