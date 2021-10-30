import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createTask, createTaskSucceeded } from '../actions';
import * as api from '../api';

// ch[9.0] testing actions

// [9.0.1] this is the template jest mock of promises that we often use
api.createTask = jest.fn(
  () => new Promise((resolve, reject) => resolve({ data: 'foo' }))
);

describe('action creators:', () => {
  
  // testing synchronous actions 
  it('#createTaskSucceeded', () => {
    const task = {
      title: 'Get swift',
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

  // [9.0.2] testing asynchronous actions creators
  
  // what does createTask do?
  // Dispatch an action indicating the request has started - store.dispatch(..)
  // Make the AJAX request with the correct arguments - mock with jest.fn()
  // When the request succeeds, dispatch an action with data from the server response. - store.getActions()

  it('#createTask', () => {

    // [9.0.2.1] mock the store
    // to accommodate async actions, use redux-mock-store's configureStore
    // we do not need it for testing actions that just return an object with type and payload information
    const mockStore = configureStore([thunk]); // alias: configureMockStore
    const store = mockStore({
      tasks: {
        items: [],
      },
    });

    const expectedActions = [
      { type: 'CREATE_TASK_REQUESTED' },
      { type: 'CREATE_TASK_SUCCEEDED', payload: { task: 'foo' } },
    ];
    // [9.0.2.2] dispatch an action using the store, mocking external dependencies
    // and assert the result
    return store.dispatch(createTask({})).then(() => {
      expect(api.createTask).toHaveBeenCalled();
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
