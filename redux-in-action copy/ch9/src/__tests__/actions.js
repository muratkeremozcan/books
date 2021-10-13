import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createTask, createTaskSucceeded } from '../actions/';

jest.unmock('../api');
import * as api from '../api';
api.createTask = jest.fn(
  () => new Promise((resolve, reject) => resolve({ data: 'foo' }))
);

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('action creators:', () => {
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
      expect(store.getActions()).toEqual(expectedActions);
      expect(api.createTask).toHaveBeenCalled();
    });
  });
});
