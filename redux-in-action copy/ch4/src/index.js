import registerServiceWorker from './registerServiceWorker';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import tasksReducer from './reducers';
import App from './App';
import './index.css';

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

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <Provider store={store}><NextApp /></Provider>,
      document.getElementById('root')
    );
  });

  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(nextRootReducer);
  });
}

registerServiceWorker();
