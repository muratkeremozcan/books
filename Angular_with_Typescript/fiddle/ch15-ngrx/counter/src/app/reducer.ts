import { Action } from '@ngrx/store';

// [1] creating a reucer function to manage state
// high level:
// define the actions (1.1)
// create the reducerFunc(state, action) and set initial state (1.2)
// check the action type with a switch statement: update the state based on cases, return default state for unknown action (1.3)


// (1.1) define the actions
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

// (1.2) create the reducerFunc(state, action) and set initial state
export function counterReducer(state = 0, action: Action) {
    // (1.3) check the action type with a switch statement: update the state based on cases, return default state for unknown action
    switch (action.type) {
        case INCREMENT:
            return state + 1;

        case DECREMENT:
            return state - 1;

        default:
            return state;
    }
}