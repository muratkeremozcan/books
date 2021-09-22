import PropTypes from "prop-types";
import { Component } from "react";
import invariant from "invariant"; // ensures that Route component never gets rendered

// This is different from what you would probably do if you were in the real world
// You would user React Router instead

// a Router component will use child components to match URL routes to components and render them out.
// A route simple wraps another component for configuration, nothing else
class Route extends Component {
  // each route takes a path and a function, specify these using propTypes
  static propTypes = {
    path: PropTypes.string,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
  };
  // The entire Route component is just a function that returns a call to the invariant library
  // if ever called, error is thrown and you’ll know things aren’t behaving correctly
  render() {
    // invariant. This is a simple tool you’ll use to ensure that errors get thrown if certain conditions aren’t met
    //  To use it, you pass in a value and a message.
    // If that value is falsey (null, 0, undefined, NaN, ''(empty string), or false), it will throw an error.
    // if you ever see a warning or error message in the developer tools console that says something like “invariant violation,”
    // it’s probably involved.
    //  You’ll use it here to make sure the Route component doesn’t render anything.
    return invariant(false,"<Route> elements are for config only and shouldn't be rendered");
  }
}

export default Route;
