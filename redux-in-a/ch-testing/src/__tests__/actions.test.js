import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createTask, createTaskSucceeded } from '../actions';
import * as api from '../api';

// ch[9.0] testing actions


// [9.0.1] this is the template jest mock of promises that we often use
api.createTask = jest.fn(
  () => new Promise((resolve, reject) => resolve({ data: 'foo' }))
);

// [9.0.2] to accommodate async actions, use redux-mock-store
// we do not need it for testing actions that just return an object with type and payload information
const mockStore = configureStore([thunk]); // alias: configureMockStore

describe('action creators:', () => {
  
  // testing synchronous actions 
  it('#createTaskSucceeded', () => {
    const task = {
      title: 'Get schwifty',
      description: 'Show me what you got',
    };
    const expectedAction = {
      type: 'CREATE_TASK_SUCCEEDED',
      payload: {
        task,
      },
    };

    expect(createTaskSucceeded(task)).toEqual(expectedAction);
  });

  // [9.0.3] testing asynchronous actions creators 
  
  // what does createTask do?
  // Dispatch an action indicating the request has started - store.dispatch(..)
  // Make the AJAX request with the correct arguments - mock with jest.fn()
  // When the request succeeds, dispatch an action with data from the server response. - store.getActions()

  it('#createTask', () => {
    const expectedActions = [
      { type: 'CREATE_TASK_REQUESTED' },
      { type: 'CREATE_TASK_SUCCEEDED', payload: { task: 'foo' } },
    ];

    const store = mockStore({
      tasks: {
        items: [],
      },
    });

    return store.dispatch(createTask({})).then(() => {
      expect(api.createTask).toHaveBeenCalled();
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
