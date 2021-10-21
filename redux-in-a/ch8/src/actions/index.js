import * as api from '../api';
import { normalize, schema } from 'normalizr';

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

// ch[8.0] redux store schemas, normlizr: normalized vs nested data is the way to go

// nested data is built on hierarchies. It is intuitive because there is no need to manage relationships
// con: update logic is complex, have to find relevant properties for each operation
// con: the data is nested, therefore we are forced to re-render the entire app when related state changes 

// normalized data is similar to a relational database; it is flat which means there is no need to update nested resources
// normalizr package makes normalization easy

// [8.1] how to normalize data (this can go with actions as in here or separate schemas file)
// define the schema for the top level entries: new.schema.Entity(..)
const taskSchema = new schema.Entity('tasks');
// identify what the relationship is, relationships are maintained via IDs (tasks: [1, 3..])  
const projectSchema = new schema.Entity('projects', {
  tasks: [taskSchema],
});


// generic action to help reduce boilerplate by not having to dispatch multiple actions 
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
      
        // [8.2] transform/normalize the API response through normalizr's normalize function(object, schema), and dispatch it
        const normalizedData = normalize(projects, [projectSchema]);

        dispatch(receiveEntities(normalizedData));

        // Pick a board to show on initial page load, sets a default projectId
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

function createTaskSucceeded(task) {
  return {
    type: 'CREATE_TASK_SUCCEEDED',
    payload: {
      task,
    },
  };
}

export function createTask({
  projectId,
  title,
  description,
  status = 'Unstarted',
}) {
  return (dispatch, getState) => {
    api.createTask({ title, description, status, projectId }).then(resp => {
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

function progressTimerStart(taskId) {
  return { type: 'TIMER_STARTED', payload: { taskId } };
}

function progressTimerStop(taskId) {
  return { type: 'TIMER_STOPPED', payload: { taskId } };
}

export function filterTasks(searchTerm) {
  return { type: 'FILTER_TASKS', payload: { searchTerm } };
}
