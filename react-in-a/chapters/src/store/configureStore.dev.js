// [10.4] setup the store

// actions are by default synchronous (just objects, not Promises or anything else)
// and often we want async actions. Redux thunk let's us have async actions
// by wrapping the dispatch method of a store so that it will handle dispatching something other than plain objects

// redux-thunk is a Redux middleware library
// in Redux middleware is used to modify the flow between action dispatch and reaching the reducer
// ... ACTION --(middleware)--> REDUCER

import thunk from "redux-thunk";
import { createStore, compose, applyMiddleware } from "redux";

import rootReducer from "../reducers/root";


let store;
export default initialState => {
  // Make sure you’re accessing the same store consistently—
  // this ensures you return the same store if another file accesses an already-created store.
  if (store) {
    return store;
  }
  const createdStore = createStore(
    rootReducer,
    initialState,
    compose( // compose utility from redux to help combine middleware
      applyMiddleware(thunk), // applyMiddleware utility to use middleware
      typeof window !== "undefined" && window.devToolsExtension
        ? window.devToolsExtension()
        : f => f
    )
  );
  store = createdStore;
  return store;
};
