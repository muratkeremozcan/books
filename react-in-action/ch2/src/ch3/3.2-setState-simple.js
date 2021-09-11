import React from "react";
import { render } from "react-dom";

// React uses both mutable (local component state) and pseudo-immutable data (props).
// Component state is tracked by a backing instance and can be modified with setState.

class Secret extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "top secret!"
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }
  onButtonClick() {
    // as an argument, setState can take an object or a function that returns an object
    this.setState(() => ({
      name: "Mark"
    }));
  }
  render() {
    return (
      <div>
        <h1>My name is {this.state.name}</h1>
        <button onClick={this.onButtonClick}>reveal the secret!</button>
      </div>
    );
  }
}

render(<Secret />, document.getElementById("root"));
