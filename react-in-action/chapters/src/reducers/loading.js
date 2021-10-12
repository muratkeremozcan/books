import initialState from "../constants/initialState";
import * as types from "../constants/types";

// ch[11.1] Reducers are pure functions that receive the previous state and an action as arguments and return the next state.
// event -> ACTION -(store.dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW

/** controls global loading state */
export function loading(state = initialState.loading, action) {
  switch (action.type) { // usually a switch statement is used to handle each type of action
    case types.app.LOADING:
      return true;
    case types.app.LOADED:
      return false;
    default: // return current state for default cases
      return state;
  }
}
