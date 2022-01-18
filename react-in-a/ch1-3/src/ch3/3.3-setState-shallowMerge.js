import React from "react";
import { render } from "react-dom";

// setState performs a shallow merge of data and updates your component’s state, preserving any top-level properties that aren’t overwritten.

class ShallowMerge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "Mark", // name exists in the initial state under the user property
        colors: {
          favorite: "",
        },
      },
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }
  onButtonClick() {
    this.setState({
      // name does not exist in the state we are setting here
      // if name was at the top level here, it would show undefined ins
      user: {
        // name: "buba", // it would overwrite the state here
        colors: {
          favorite: "blue",
        },
      },
    });
  }
  render() {
    return (
      <div>
        <h1>
          My favorite color is {this.state.user.colors.favorite} and my name is
          {` ${this.state.user.name}`}
        </h1>
        <button onClick={this.onButtonClick}>show the color!</button>
      </div>
    );
  }
}

render(<ShallowMerge />, document.getElementById("root"));
