import React from "react"; 
import { render } from "react-dom"; 
import PropTypes from "prop-types";

class Counter extends React.Component {
  // To set PropTypes for a component, you provide a static property called propTypes.
  static propTypes = {
    incrementBy: PropTypes.number,
    onIncrement: PropTypes.func.isRequired //#B
  };
  // to set default props, you provide a static property called defaultProps.
  static defaultProps = {
    incrementBy: 1
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }
  onButtonClick() {
    // as an argument, setState can take either an object or a function that returns an object
    this.setState(function(prevState, props) {
      return { count: prevState.count + props.incrementBy };
    });
  }
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.onButtonClick}>++</button>
      </div>
    );
  }
}

// if we do not specify the property, it will increment by 1
render(<Counter incrementBy={5} />, document.getElementById("root"));
