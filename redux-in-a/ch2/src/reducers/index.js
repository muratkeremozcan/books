import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../constants';

// ch[1.0] decide upfront how the data will look like to determine  what kinds of actions and reducers you might need. 
// it may be helpful to think of client-side state like a database. 
// Similarly to if you were dealing with a persistent data store such as a SQL database, declaring a data model will help you organize your thoughts and drive out the code you need.

// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -(selector)-> update VIEW
// ch[2.3] create reducers
// reducers are pure functions that receive the previous state and an action as arguments and return the next state.

// you took care of the redux boilerplate (2.0)
// you created the actions & action handlers (2.1) 
// you linked the a container component (App.js) to Redux, you are dispatching actions (2.2)
// now you can create the reducers
// once you update your actions (4.0), you also update your reducers


const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  searchTerm: '',
};

export default function tasks(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_TASKS_STARTED': {
      return {
        ...state, // include any previous state when updating state
        isLoading: true,
      };
    }
    case 'FETCH_TASKS_SUCCEEDED': {
      return { // returns the next state with the the list of tasks from the payload
        ...state,
        tasks: action.payload.tasks,
        isLoading: false,
      };
    }
    case 'FETCH_TASKS_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case 'CREATE_TASK_SUCCEEDED': {
      return {
        ...state,
        tasks: state.tasks.concat(action.payload.task), // add on to the existing state.property
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const { payload } = action;
      // to update the right task iterate over the list of tasks with map
      // if the current task matches the ID from the payload, update it with the new params.
      // Because json-server requires a full object to be passed along for PUT requests,
      // you must grab the task out of the store and merge in the new properties yourself,
      const nextTasks = state.tasks.map(task => {
        if (task.id === payload.task.id) {
          return payload.task;
        }

        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
      };
    }
    case 'TIMER_INCREMENT': {
      const nextTasks = state.tasks.map(task => {
        if (task.id === action.payload.taskId) {
          return { ...task, timer: task.timer + 1 };
        }

        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
      };
    }
    case 'FILTER_TASKS': {
      return { ...state, searchTerm: action.payload.searchTerm };
    }
    default: {
      return state;
    }
  }
}

// [7.1] typically selectors are in the related reducer file
 
export const getTasks = state => state.tasks.tasks;
export const getSearchTerm = state => state.tasks.searchTerm;

// [7.2] reselect library is great for creating selectors, because it provides memoization and composability (like FP)
// memoization is when a function stores the results of past computations and uses them for future calls.

// createSelector takes an array of input selectors and a transform function
// the transform functions arguments will be the result of the input selectors
// memoization comes for free; this will not re-compute the same filtered tasks twice if receiving the same args (tasks, searchTerm)
export const getFilteredTasks = createSelector(
  // input selectors are simple, they are not memoized, but are used as inputs to memoized selectors
  // with this setup, the transform function only runs when the result of the input selectors change
  [getTasks, getSearchTerm],
  (tasks, searchTerm) => {
    return tasks.filter(task => task.title.match(new RegExp(searchTerm, 'i')));
  }
);

export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks],
  tasks => {
    const grouped = {};

    TASK_STATUSES.forEach(status => {
      grouped[status] = tasks.filter(task => task.status === status);
    });

    return grouped;
  }
);
