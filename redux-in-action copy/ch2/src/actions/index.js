import * as api from '../api';

let _id = 1;
export function uniqueId() {
  return _id++;
}

// ch[2.1]
// event -> ACTION -(store.dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW
// KEY ch[4.0]: ACTION can communicate with the back end asynchronously
// event -> ACTION -(async-communication-with-back-end)-(store.dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW

// In Redux, actions are payloads of information that send data from your application to your store.
// actions return an object with a required type key
// actions represent all the basic ways a user can interact with the app
// we also need to use the dispatch fn (from Redux) to dispatch the action

// actions are handled by container components (ex: App.js)
// side effects are handled at actions

// Users and servers are the two actors that can modify state in your applications
// optionally, you can group actions in to view actions and server actions


// synchronous action creators just return an action.
// the store will receive and process the action immediately after dispatch
function fetchTasksSucceeded(tasks) { 
  return { // the action
    type: 'FETCH_TASKS_SUCCEEDED', // action type
    payload: { // action payload
      tasks,
    },
  };
}

function fetchTasksFailed(error) {
  return {
    type: 'FETCH_TASKS_FAILED',
    payload: {
      error,
    },
  };
}

function fetchTasksStarted() {
  return {
    type: 'FETCH_TASKS_STARTED',
  };
}

// ch[4.0] asynchronous action creators return a function that accepts a dispatch argument
// they do some async work with the back-end, and then call dispatch with an sync action creators

// The redux-thunk package allows you to dispatch functions instead of objects, 
// and inside those functions you can make network requests and dispatch additional actions when any requests complete.

export function fetchTasks() {
  return dispatch => {
    dispatch(fetchTasksStarted());

    api
      .fetchTasks()
      .then(resp => {
        dispatch(fetchTasksSucceeded(resp.data)); // the store will receive and process the sync action immediately after dispatch
      })
      .catch(err => {
        dispatch(fetchTasksFailed(err.message));
      });
  };
}

function createTaskSucceeded(task) {
  return {
    type: 'CREATE_TASK_SUCCEEDED',
    payload: {
      task,
    },
  };
}

export function createTask({ title, description }) { // action creator
  return {
    type: 'CREATE_TASK', 
    payload: { 
      id: uniqueId(),
      title,
      description,
      status: 'Unstarted'
    },
  };
}

export function editTask(id, params = {}) {
  return {
    type: 'EDIT_TASK',
    payload: {
      id,
      params,
    },
  };
}
