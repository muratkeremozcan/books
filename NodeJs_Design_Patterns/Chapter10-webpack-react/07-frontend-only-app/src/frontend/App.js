import react from 'react'
import htm from 'htm'
import { Switch, Route } from 'react-router-dom'
import { AuthorsIndex } from './components/pages/AuthorsIndex.js'
import { Author } from './components/pages/Author.js'
import { FourOhFour } from './components/pages/FourOhFour.js'

const html = htm.bind(react.createElement)

// code, the App component is responsible for loading all the page components and configuring the routing for them
// By specifying exact: true, we are telling the router to only match this path if it is exactly / (and not if it just starts with /).
export class App extends react.Component {
  render () {
    return html`
      <${Switch}>
        <${Route}
          path="/"
          exact=${true} 
          component=${AuthorsIndex}
        />
        <${Route}
          path="/author/:authorId"
          component=${Author}
        />
        <${Route}
          path="*"
          component=${FourOhFour}
        />
      </>
    `
  }
}
