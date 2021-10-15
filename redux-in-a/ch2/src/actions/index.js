import * as api from '../api';

let _id = 1;
export function uniqueId() {
  return _id++;
}

// ch[2.1]
// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW
// KEY ch[4.0]: ACTION can communicate with the back end asynchronously
// event -> ACTION -(async-communication-with-back-end)-(dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW

// In Redux, actions are payloads of information that send data from your application to your store.
// actions return an object with a required type key
// actions represent all the basic ways a user can interact with the app
// we also need to use the dispatch fn (from Redux) to dispatch the action

// actions are handled by container components (ex: App.js)
// side effects are handled at actions

// Users and servers are the two actors that can modify state in your applications
// optionally, you can group actions in to view actions and server actions

// With network requests (server as actor), there are two moments in time that you care about: when the request starts, and when it completes. 
// If you model these events as actions, you end up with three distinct action types that help describe the request-response lifecycle.
// ACTION_STARTED, ACTION_SUCCEEDED, and ACTION_FAILED
// With user as actor, you need to worry about the ACTION_SUCCEEDED action type, and maybe ACTION_FAILED



// synchronous action creators just return an action.
// the store will receive and process the action immediately after dispatch
function fetchTasksSucceeded(tasks) {  // action creator
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
// they do some async work with the back-end, and then call dispatch with a sync action creators
// For each action that requires a network request (meaning you’re dealing with an async action),
// you’ll need at least one synchronous action creator to indicate where you are in the request/response lifecycle.


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

// async actions need return a function instead of an object.
//  Within that function, you can make your API call 
// and dispatch a sync action when a response is available.
export function createTask({ title, description, status = 'Unstarted' }) {
  return dispatch => {
    api.createTask({ title, description, status }).then(resp => {
      // KEY: the dispatch to the store only after successful api response
      dispatch(createTaskSucceeded(resp.data));
    });
  };
}

function editTaskSucceeded(task) {
  return {
    type: 'EDIT_TASK_SUCCEEDED',
    payload: {
      task,
    },
  };
}

export function editTask(id, params = {}) {
  return (dispatch, getState) => {
    // merges new properties into existing task object
    const task = getTaskById(getState().tasks.tasks, id);
    const updatedTask = Object.assign({}, task, params);
    api.editTask(id, updatedTask).then(resp => {
      dispatch(editTaskSucceeded(resp.data));
    });
  };
}

function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}
