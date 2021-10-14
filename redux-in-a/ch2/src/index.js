import registerServiceWorker from './registerServiceWorker';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
// redux-thunk is a Redux middleware library, it allows you to dispatch functions instead of objects, 
// and inside those functions you can make network requests and dispatch additional actions when any requests complete.
// in Redux middleware is used to modify the flow between action dispatch and reaching the reducer
// ... ACTION --(middleware)--> REDUCER
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import tasksReducer from './reducers';
import App from './App';
import './index.css';

// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW

// Actions in Redux represent work being done (fetching user data, logging the user in, and so on),
// reducers determine how state should change,
// the store holds a centralized copy of state,
// and middleware allows you to inject custom behavior into the process

// Apart from an action, the store doesn’t have any other way to get data.
// Actions are used throughout a Redux application to initiate changes in data,
// Reducers are involved with responsible for updating the state (store) of the app.

// An action is created when you want to update state (usually due to an event like a click).
// The action will have a type that a certain reducer will handle.
// The reducer that handles the given action type will make a copy of the current state,
// modify it with data from the action, and then return the new state.
// When the store is updated, view layers (React in our case) can listen to updates and respond accordingly.


// ch[2.0] react-redux gives you two primary tools for connecting your Redux store to React: 

// * Provider - a React component that you’ll render at the top of the React app. 
// takes  the store as a prop and wraps the top-level component in your app
// any child component rendered within Provider can access the Redux store

// * connect — connect(mapStateToProps)(a Component): a function used as a bridge between React components and data from the Redux store.


// ch[3.1] to enable redux dev tools
// npm i -D redux-devtools-extension
// import and pass devToolsEnhancer into Redux's createStore 

// Redux’s createStore function takes up to three arguments: a reducer, an initial state, and an enhancer. 
// In the case that only two arguments are passed, Redux presumes the second argument is an enhancer and there’s no initial state. 
// Enhancers are a way to augment the Redux store 

// ch[4.2] the oot reducer is needed to integrate the reducers with the Redux store.
// rootReducer takes in the current state and the action being dispatched
// then passes the data & action to the reducers
const rootReducer = (state = {}, action) => {
  return {
    tasks: tasksReducer(state.tasks, action),
  };
};

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// ch[3.2] hot module replacement: have webpack watch for changes in the code and automatically reload the page

// create react app has hot module replacement enabled in development mode
// accept command takes 2 args: dependencies and callback
// whenever the App component or its children change, re-render the component
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <Provider store={store}><NextApp /></Provider>,
      document.getElementById('root')
    );
  });

  // makes sense to add hot module replacement to reducers 
  // so that we can make changes to reducers and see data in the respective components in real time
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(nextRootReducer);
  });
}

registerServiceWorker();
