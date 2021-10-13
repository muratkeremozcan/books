import * as types from '../constants/types';

// ch [10.2] actions
// actions just return an object with a required type key
// actions represent all the basic ways a user can interact with the app
// we also need to use the dispatch fn (from Redux) to dispatch the action
export function loading() {
  return {
    type: types.app.LOADING
  };
}

export function loaded() {
  return {
    type: types.app.LOADED
  };
}
