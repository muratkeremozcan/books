import thunk from "redux-thunk";
import { createStore, compose, applyMiddleware } from "redux";

import rootReducer from "../reducers/root";
import crashReporting from "../middleware/crash";

// [10.4] setup the store

let store;
// Pass in initial state to your configuration for Redux to use
export default function configureStore(initialState) {
  // Make sure you’re accessing the same store consistently—
  // this ensures you return the same store if another file accesses an already-created store.
  if (store) {
    return store;
  }
  // use Redux createStore method to create your store
  store = createStore(
    rootReducer,
    initialState,
    // compose utility from redux help combine middleware
    compose(applyMiddleware(thunk, crashReporting))
    );
  return store;
}


