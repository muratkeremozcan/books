
// ch[1.0] decide upfront how the data will look like to determine  what kinds of actions and reducers you might need. 
// it may be helpful to think of client-side state like a database. 
// Similarly to if you were dealing with a persistent data store such as a SQL database, declaring a data model will help you organize your thoughts and drive out the code you need.

// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW
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
    default: {
      return state;
    }
  }
}