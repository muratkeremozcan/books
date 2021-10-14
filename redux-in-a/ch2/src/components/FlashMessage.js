// Even though you don’t reference React directly in this file, the React object needs to be in scope to use JSX.
import React from 'react';

export default function FlashMessage(props) {
  return (
    <div className="flash-error">
      {props.message}
    </div>
  );
}

FlashMessage.defaultProps = {
  message: 'An error occurred',
};
