import registerServiceWorker from './registerServiceWorker';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// redux-thunk is a Redux middleware library, it allows you to dispatch functions instead of objects, 
// and inside those functions you can make network requests and dispatch additional actions when any requests complete.
// in Redux middleware is used to modify the flow between action dispatch and reaching the reducer
// ... ACTION --(middleware)--> REDUCER
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { projects, tasks, page } from './reducers';
import App from './App';
import rootSaga from './sagas';
import './index.css';

// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> container component gets state data out of STORE through selectors -> VIEW is updated
// generic flow: update actions -> update reducers -> update rootReducer -> update selectors to get data out of the store, use mapStateToProps -> update view

// Actions in Redux represent work being done (fetching user data, logging the user in, and so on),
// reducers determine how state should change,
// the store holds a centralized copy of state,

// Apart from an action, the store doesn’t have any other way to get data.
// Actions are used throughout a Redux application to initiate changes in data,
// Reducers are involved with responsible for updating the state (store) of the app.

// An action is created when you want to update state (usually due to an event like a click).
// The action will have a type that a certain reducer will handle.
// The reducer that handles the given action type will make a copy of the current state,
// modify it with data from the action, and then return the new state.
// When the store is updated, view layers (React in our case) can listen to updates and respond accordingly.

// Redux’s createStore function takes up to three arguments: a reducer, an initial state, and an enhancer. 
// In the case that only two arguments are passed, Redux presumes the second argument is an enhancer and there’s no initial state. 
// Enhancers are a way to augment the Redux store 

// [4.2] we have created actions (2.1) and async actions (4.0), actions now need to talk to reducers
// the root reducer is needed to integrate the reducers with the Redux store.
// rootReducer takes in the current state and the action being dispatched
// then passes the data & action to the reducers

// data from the api is normalized and actions are updated (8.1) (8.2), reducers have been adjusted (8.3)
// [8.4] update the rootReducer; reducers will have different shaped arguments
// This is a generic flow: update actions -> update reducers -> update rootReducer -> update selectors to get data out of the store, use mapStateToProps -> update view
const rootReducer = (state = {}, action) => {
  return {
    projects: projects(state.projects, action),
    tasks: tasks(state.tasks, action),
    page: page(state.page, action),
  };
};

// ch[6.0]Sagas: a middleware useful for managing complex side effects with flows, it is an alternative to redux-thunk for complex scenarios
// sagas are built using generators which can be paused and resumed. redux-saga is an alternative to redux-observables or rxjs from Angular
// use createSagaMiddleware() factory function to create sagaMiddleware
// register the middleware in the store using applyMiddleware(..) from Redux
// create the sagas (6.2), (6.3), be aware that they work with actions (6.4)
const sagaMiddleware = createSagaMiddleware();

// ch[3.1] to enable redux dev tools (not very KEY)
// npm i -D redux-devtools-extension
// import and pass devToolsEnhancer into Redux's createStore 

// ch [5.0] in Redux middleware is used to modify the flow between action dispatch and reaching the reducer
// middleware is any code that runs between two software components
// with Express, you can have middleware that runs after an incoming request is received, and before the framework handles a request. 
// useful for things such as logging data about each request and response, handling errors in a centralized way, authenticating users etc.

// when to use middleware?
// middleware is meant to centralize & abstract logic that is common to many software components 
// Ex: logging statements everywhere -> not scalable. Instead use middleware for code tha applies to many if not all actions in the application.

// [5.1] creating a middleware in Redux
// define the middleware: ./src/middleware/mwName.js ,  const mwExample= store => next => action => {..}
/// store — use the store object in middleware when you need to make decisions based on an existing state. ex: store.getState(), store.dispatch(someFn) 
/// next — signifies when the current mw completed its work, and it's time to move on to the next middleware in the chain. ex: return next(action) 
/// action — the action being dispatched. generally, your middleware will do something with every action (such as logging) or watch for a specific action
// [5.2] import the middleware into ./src/index.js where your store is
// register the middleware in the store using applyMiddleware(..) from Redux
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, sagaMiddleware))
);

// ch[6.1] initiate the saga with the run method, and tell redux-saga which saga(s) to run
sagaMiddleware.run(rootSaga);

// ch[2.0] redux boilerplate
//react-redux gives you two primary tools for connecting your Redux store to React: 

// * Provider - a React component that you’ll render at the top of the React app. 
// takes  the store as a prop and wraps the top-level component in your app
// any child component rendered within Provider can access the Redux store
// * connect — connect(mapStateToProps)(a Component): a function used as a bridge between React components and data from the Redux store (App.js).

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
      <Provider store={store}>
        <NextApp />
      </Provider>,
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
