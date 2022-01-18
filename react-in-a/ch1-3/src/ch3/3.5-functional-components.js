import React from "react";
import { render } from "react-dom";
import PropTypes from "prop-types";

// stateless/functional components do not inherit from React.Component and do not have access to React state api.
// they do not have lifecycle methods either
// they only use props and no state (hooks allow them to use state, that topic in another  book...)

// they can be created functions or anonymous functions, or arrow functions
const Greeting = (props) => <div>Hello {props.name}</div>;
Greeting.propTypes = {
  name: PropTypes.string.isRequired,
};

Greeting.defaultProps = {
  name: "friend",
};

render(<Greeting name="Mark" />, document.getElementById("root"));
