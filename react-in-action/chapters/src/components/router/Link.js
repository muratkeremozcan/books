import PropTypes from 'prop-types';
import { Children, cloneElement } from 'react';
import { navigate } from '../../history';

/**
 * Link component helps you navigate around the app
 * @method      Link
 * @param       {object} props
 * @constructor
 */
function Link({ to, children }) {
    // [8.1] use React.cloneElement to create a copy of the target element and then attach a click handler that will perform navigation.
    return cloneElement(Children.only(children), {
        onClick: () => navigate(to)
    });
}

Link.propTypes = {
    to: PropTypes.string,
    children: PropTypes.node
};

export default Link;
