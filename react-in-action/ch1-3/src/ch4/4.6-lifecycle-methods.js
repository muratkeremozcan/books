import React from "react";
import { render } from "react-dom";
import PropTypes from "prop-types";

// Lifecycle methods are special methods attached to class-based React components that will be executed at specific points in a component’s lifecycle.
// Stateless functional components don’t have lifecycle methods available to them. You also can’t use this.setState inside them because they don’t have backing instances;
// They can still have their data updated by a parent via props, but you don’t get access to lifecycle methods. 
// That may seem like a hindrance or like they’re less powerful, but in many cases they’re all you need.

// Components have four main parts of their lifecycle and corresponding lifecycle methods for each:
// Initialization— When a component class is being instantiated. 
// Mounting— A component is being inserted into the DOM. 
// Updating— A component is being updated with new data via state or props. 
// Unmounting— A component is being removed from the DOM.

// Lifecycle methods can be broken into two main groups:
// Will methods— Called right before something happens 
// Did methods— Called right after something happens



class ChildComponent extends React.Component {
  static propTypes = {
    name: PropTypes.string
  };
  // Set default props—normally you’d set this as an object and not a function, but you’re using an immediately executing function to inject the console.log statement.
  static defaultProps = (function() { // initialization.1
    console.log("ChildComponent : defaultProps");
    return {};
  })();
  constructor(props) { 
    super(props);
    console.log("ChildComponent: state");
    this.state = { // initialization.2 
      name: "Mark"
    };
    this.oops = this.oops.bind(this); // error handling.1 : bind the class method
  }
  // parent calls componentWillMount first, but needs to wait for children components to be mounted
  // componentWillMount is the only time we can change state before the component mounts
  componentWillMount() { // mounting.1
    console.log("ChildComponent : componentWillMount");
  }
  // parent won't finish mounting until its children have mounted, so children call componentDidMount first
  componentDidMount() { // render into the DOM first, then this - mounting.2
    console.log("ChildComponent : componentDidMount");
  }
  // once mounted, a component exists in the DOM

  // child is updated with new state passed via props from the parent. React updates the DOM to keep it in sync with vDOM
  componentWillReceiveProps(nextProps) { // updating.1
    console.log("ChildComponent : componentWillReceiveProps()");
    console.log("nextProps: ", nextProps);
  } 
  // here you can control if a component should update or not, by returning true or false
  // if false, the next update methods will not be called
  shouldComponentUpdate(nextProps, nextState) { // updating.2
    console.log("<ChildComponent/> - shouldComponentUpdate()");
    console.log("nextProps: ", nextProps);
    console.log("nextState: ", nextState);
    return true;
  }
  componentWillUpdate(nextProps, nextState) { // updating.3
    console.log("<ChildComponent/> - componentWillUpdate");
    console.log("nextProps: ", nextProps);
    console.log("nextState: ", nextState);
  }
  componentDidUpdate(previousProps, previousState) { // render into the DOM, then this - updating.4
    console.log("ChildComponent: componentDidUpdate");
    console.log("previousProps:", previousProps);
    console.log("previousState:", previousState);
  }
  componentWillUnmount() { // unmounting
    console.log("ChildComponent: componentWillUnmount");
  }
  oops() { // error handling.2 : toggle state to throw an error
    this.setState(() => ({ oops: true }));
  }
  render() {
    if (this.state.oops) { // error handling.3 : throw error in th render method
      throw new Error("Something went wrong");
    }
    console.log("ChildComponent: render");
    return [
      <div key="name">Name: {this.props.name}</div>,
      <button key="error" onClick={this.oops}>
        Create error
      </button>
    ];
  }
}

class ParentComponent extends React.Component {
  static defaultProps = (function() { // initialization.1
    console.log("ParentComponent: defaultProps");
    return {
      true: false
    };
  })();
  constructor(props) {
    super(props);
    console.log("ParentComponent: state");
    this.state = { text: "" }; // initialization.2
    this.onInputChange = this.onInputChange.bind(this);
  }
  componentWillMount() { // mouting.1
    console.log("ParentComponent: componentWillMount");
  }
  componentDidMount() {  // render into the DOM first, then this - mounting.2
    console.log("ParentComponent: componentDidMount");
  }
  componentWillUnmount() { // unmounting
    console.log("ParentComponent: componentWillUnmount");
  }
  onInputChange(e) {
    const text = e.target.value;
    this.setState(() => ({ text: text }));
  }
  componentDidCatch(err, errorInfo) { // error handling.4 : add a componentDidCatch to the child and use it to update component state
    console.log("componentDidCatch");
    console.error(err);
    console.error(errorInfo);
    this.setState(() => ({ err, errorInfo }));
  }
  render() {
    console.log("ParentComponent: render");
    // error handling.5 : if an error is thrown, display the error and the message
    if (this.state.err) {
      return (
        <details style={{ whiteSpace: "pre-wrap" }}>
          {this.state.error && this.state.error.toString()}
          <br />
          {this.state.errorInfo.componentStack} 
        </details>
      );
    }
    return [
      <h2 key="h2">Learn about rendering and lifecycle methods!</h2>,
      <input
        key="input"
        value={this.state.text}
        onChange={this.onInputChange}
      />,
      // render the child within the parent
      <ChildComponent key="ChildComponent" name={this.state.text} />
    ];
  }
}

render(<ParentComponent />, document.getElementById("root"));
