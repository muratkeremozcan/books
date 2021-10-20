import * as api from '../api';
import { normalize, schema } from 'normalizr';


// ch[2.1]
// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -(selector)-> update VIEW
// KEY ch[4.0]: ACTION can communicate with the back end asynchronously
// event -> ACTION -(async-communication-with-back-end)-(dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW

// In Redux, actions are payloads of information that send data from your application to your store.
// actions return an object with a required type key
// actions represent all the basic ways a user can interact with the app
// we also need to use the dispatch fn (from Redux) to dispatch the action

// actions are handled by container components (ex: App.js)
// side effects can occur at actions and/or middleware

// Users and servers are the two actors that can modify state in your applications
// optionally, you can group actions in to view actions and server actions

// With network requests (server as actor), there are two moments in time that you care about: when the request starts, and when it completes. 
// If you model these events as actions, you end up with three distinct action types that help describe the request-response lifecycle.
// ACTION_STARTED, ACTION_SUCCEEDED, and ACTION_FAILED
// With user as actor, you need to worry about the ACTION_SUCCEEDED action type, and maybe ACTION_FAILED

export const SET_CURRENT_PROJECT_ID = 'SET_CURRENT_PROJECT_ID';
export function setCurrentProjectId(id) {
  return {
    type: 'SET_CURRENT_PROJECT_ID',
    payload: {
      id,
    },
  };
}

export const FETCH_PROJECTS_STARTED = 'FETCH_PROJECTS_STARTED';
function fetchProjectsStarted(boards) {
  return { type: FETCH_PROJECTS_STARTED, payload: { boards } };
}

export const FETCH_PROJECTS_FAILED = 'FETCH_PROJECTS_FAILED';
function fetchProjectsFailed(err) {
  return { type: FETCH_PROJECTS_FAILED, payload: err };
}

const taskSchema = new schema.Entity('tasks');
const projectSchema = new schema.Entity('projects', {
  tasks: [taskSchema],
});

function receiveEntities(entities) {
  return {
    type: 'RECEIVE_ENTITIES',
    payload: entities,
  };
}

export function fetchProjects() {
  return (dispatch, getState) => {
    dispatch(fetchProjectsStarted());

    return api
      .fetchProjects()
      .then(resp => {
        const projects = resp.data;

        const normalizedData = normalize(projects, [projectSchema]);

        dispatch(receiveEntities(normalizedData));

        // Pick a board to show on initial page load
        if (!getState().page.currentProjectId) {
          const defaultProjectId = projects[0].id;
          dispatch(setCurrentProjectId(defaultProjectId));
        }
      })
      .catch(err => {
        fetchProjectsFailed(err);
      });
  };
}

export function fetchTasksStarted() {
  return {
    type: 'FETCH_TASKS_STARTED',
  };
}

export function fetchTasksSucceeded() {
  return {
    type: 'FETCH_TASKS_SUCCEEDED',
  };
}

export function fetchTasks(boardId) {
  return dispatch => {
    return api.fetchTasks(boardId).then(resp => {
      dispatch(fetchTasksSucceeded(resp.data));
    });
  };
}

// (2.1) synchronous action creators just return an action.
// the store will receive and process the action immediately after dispatch
function createTaskSucceeded(task) {
  // the action
  return {
    // the action type
    type: 'CREATE_TASK_SUCCEEDED',
    // the action payload
    payload: {
      task,
    },
  };
}

// ch[4.0] asynchronous action creators return a function that accepts a dispatch argument
// they do some async work with the back-end, and then call dispatch with a sync action creators
// For each action that requires a network request (meaning you’re dealing with an async action),
// you’ll need at least one synchronous action creator to indicate where you are in the request/response lifecycle.

// The redux-thunk package allows you to dispatch functions instead of objects, 
// and inside those functions you can make network requests and dispatch additional actions when any requests complete.

// async actions need return a function instead of an object.
//  Within that function, you can make your API call 
// and dispatch a sync action when a response is available.
export function createTask({
  projectId,
  title,
  description,
  status = 'Unstarted',
}) {
  return (dispatch, getState) => {
    api.createTask({ title, description, status, projectId }).then(resp => {
      // KEY: the dispatch to the store only after successful api response
      // the store will receive and process the sync action immediately after dispatch
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

export function editTask(task, params = {}) {
  return (dispatch, getState) => {
    // merges new properties into existing task object
    const updatedTask = {
      ...task,
      ...params,
    };
    api.editTask(task.id, updatedTask).then(resp => {
      dispatch(editTaskSucceeded(resp.data));

      // if task moves into "In Progress", start timer
      if (resp.data.status === 'In Progress') {
        return dispatch(progressTimerStart(resp.data.id));
      }

      // if tasks move out of "In Progress", stop timer
      if (task.status === 'In Progress') {
        return dispatch(progressTimerStop(resp.data.id));
      }
    });
  };
}

// [6.4] when using sagas: coordinate the sagas with the actions. Note that not all actions are used in sagas.
function progressTimerStart(taskId) {
  return { type: 'TIMER_STARTED', payload: { taskId } };
}

function progressTimerStop(taskId) {
  return { type: 'TIMER_STOPPED', payload: { taskId } };
}

export function filterTasks(searchTerm) {
  return { type: 'FILTER_TASKS', payload: { searchTerm } };
}
