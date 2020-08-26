import { Action } from '@ngrx/store';

// [1] creating a reducer function to manage state
// high level:
// define the actions (1.1)
// create the reducerFunc(state, action) and set initial state (1.2)
// check the action type with a switch statement: update the state based on cases, return default state for unknown action (1.3)

// [2] at app.module.ts: import StoreModule and define the name of the state, set its value as the reducerFunc:
// StoreModule.forRoot({stateName: reducerFunc})
// [3] setup the component to get the state and effect the state
// (3.1) at the component, have a dummy observable to display the state
// (3.2) inject the store to the constructor and use store.select('stateName') for the component to get the state
// (3.3) set the state with functions that perform store.dispatch({type: actionsDefinedIn[1]})

// (1.1) define the actions that can effect the state
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