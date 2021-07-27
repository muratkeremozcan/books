import react from 'react'
import ReactDOM from 'react-dom'

// create a handy alias for the react.createElement function, plain dom nodes/html tags or react components
const h = react.createElement 

class Hello extends react.Component { // define our Hello component, which has to extend the react.Component class
  // Every React component has to implement a render() method. 
  // This method defines how the component will be displayed on the screen when it is rendered on the DOM and returns a React element
  render () {
    // react.createElement method expects three or more arguments. 
    // The first argument is the tag name (as a string) or a React component class.
    // The second argument is an object used to pass attributes (or props) to the component (or null if we don't need to specify any attribute). 
    // Finally, the third argument is an array (or you can pass multiple arguments as well) of children elements. E
    // lements can also be text (text nodes), as in our current example
    return h('h1', null, [
      'Hello ',
      this.props.name || 'World'
    ])
  }
}

// This function is responsible for attaching a React application to the existing page. 
// Here, we are instantiating our Hello component and passing the string "React" for the name attribute. 
// Finally, as the last argument, we have to specify which DOM node in the page will be the parent element of our application. 
// In this case, we are using the body element of the page, but you can target any existing DOM element in the page.
ReactDOM.render(
  h(Hello, { name: 'React' }),
  document.getElementsByTagName('body')[0]
)
