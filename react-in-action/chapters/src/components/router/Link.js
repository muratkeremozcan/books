import PropTypes from "prop-types";
import { Children, cloneElement } from "react";
import { navigate } from "../../history";

// ch [7.1] You’ll need to use your history utility here and integrate it into a Link component
// Using the navigate function made earlier, you can tell the history library to change the location for the user.
// To turn this functionality into a component, you’ll use some React utilities to wrap other components in a clickable Link component.
// You’ll use React.cloneElement to create a copy of the target element and then attach a click handler that will perform navigation.


/**
 * Link component helps you navigate around the app
 * to and children hold the target url and component you are linking
 */
function Link({ to, children }) {
  // in props object, pass the click handler that will navigate to the url using history
  return cloneElement(Children.only(children), {
    onClick: () => navigate(to)
  });
}

Link.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node
};

export default Link;
