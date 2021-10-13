import * as api from '../api';

import { CALL_API } from '../middleware/api';

export const FETCH_TASKS_STARTED = 'FETCH_TASKS_STARTED';
export const FETCH_TASKS_SUCCEEDED = 'FETCH_TASKS_SUCCEEDED';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';

export function fetchTasks() {
  return {
    [CALL_API]: {
      types: [FETCH_TASKS_STARTED, FETCH_TASKS_SUCCEEDED, FETCH_TASKS_FAILURE],
      endpoint: '/tasks',
    },
  };
}

export const CREATE_TASK_STARTED = 'CREATE_TASK_STARTED';
export const CREATE_TASK_SUCCEEDED = 'CREATE_TASK_SUCCEEDED';
export const CREATE_TASK_FAILED = 'CREATE_TASK_FAILED';

export function createTask({ title, description, status = 'Unstarted' }) {
  return {
    [CALL_API]: {
      types: [CREATE_TASK_STARTED, CREATE_TASK_SUCCEEDED, CREATE_TASK_FAILED],
      endpoint: '/tasks',
      method: 'POST',
      body: {
        title,
        description,
        status,
      },
    },
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
    const task = getTaskById(getState().tasks.tasks, id);
    const updatedTask = {
      ...task,
      ...params,
    };
    api.editTask(id, updatedTask).then(resp => {
      dispatch(editTaskSucceeded(resp.data));
    });
  };
}

function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}
