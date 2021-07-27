import react from 'react'
import htm from 'htm'

const html = htm.bind(react.createElement)

function createRequestUri (query) {
  return `https://api.github.com/search/repositories?q=${
    encodeURIComponent(query)
  }&sort=updated`
}

export class RecentGithubProjects extends react.Component {
  // we are overriding the default constructor. A constructor accepts the props passed to the component as an argument
  constructor (props) {
    // The first thing we have to do is call the original constructor and propagate the props so that the component can be initialized correctly by React. 
    super(props)
    // Now, we can define the initial component state. 
    // Our final state is going to be a list of GitHub projects, but those won't be available immediately as we will need to load them dynamically. 
    // Therefore, we define the initial state as a boolean flag, indicating that we are loading the data and the list of projects as an empty array.
    this.state = {
      loading: true,
      projects: []
    }
  }

  /**
   *The function loadData() is the function that is responsible for making the API request, fetching the necessary data, 
   and updating the internal state using this.setState(). 
   Note that this.setState() is called twice: before we issue the HTTP request (to activate the loading state) 
   and when the request is completed (to unset the loading flag and populate the list of projects). 
   React will re-render the component automatically when the state changes.
  */
  async loadData () {
    this.setState({ loading: true, projects: [] })
    const response = await fetch(
      createRequestUri(this.props.query),
      { mode: 'cors' }
    )
    const responseBody = await response.json()
    this.setState({
      projects: responseBody.items,
      loading: false
    })
  }
  
  /**
  we are introducing another new concept: the componentDidMount lifecycle function. 
  This function is automatically invoked by React once the component has been successfully instantiated and attached (or mounted) to the DOM. 
  This is the perfect place to load our data for the first time.
  */
  componentDidMount () {
    this.loadData()
  }

  /**
  The function componentDidUpdate is another React lifecycle function and it is automatically invoked every time the component is updated 
  (for instance, if new props have been passed to the component). 
  Here, we check if the query prop has changed since the last update. If that's the case, then we need to reload the list of projects.
  */
  componentDidUpdate (prevProps) {
    if (this.props.query !== prevProps.query) {
      this.loadData()
    }
  }

  /**
  The main thing to note is that here we have to handle the two different states of the component: 
  the loading state and the state where we have the list of projects available for display. 
  Since React will invoke the render() function every time the state or the props change, just having an if statement here will be enough. 
  This technique is often called conditional rendering.
  */
  render () {
    if (this.state.loading) {
      return 'Loading ...'
    }

    /*
    we are rendering a list of elements using Array.map() to create a list element for every project fetched using the GitHub API.
    Note that every list element receives a value for the key prop. 
    The key prop is a special prop that is recommended whenever you are rendering an array of elements. 
    Every element should provide a unique key. This prop helps the virtual DOM optimize every rendering pass
    */
    return html`<ul>
      ${this.state.projects.map(project => html`
        <li key=${project.id}>
          <a href=${project.html_url}>${project.full_name}</a>:
          ${' '}${project.description}
        </li>
      `)}
    </ul>`
  }
}
