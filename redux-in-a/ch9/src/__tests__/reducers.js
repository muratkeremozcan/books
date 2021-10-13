import tasks from '../reducers/';

describe('reducer', () => {
  const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
    searchTerm: '',
  };

  it('returns initialState', () => {
    expect(tasks(undefined, {})).toEqual(initialState);
  });

  it('FETCH_TASKS_STARTED', () => {
    const action = { type: 'FETCH_TASKS_STARTED' };
    const expectedState = { ...initialState, isLoading: true };

    expect(tasks(initialState, action)).toEqual(expectedState);
  });

  it('FETCH_TASKS_SUCCEEDED', () => {
    const taskList = [{ title: 'Test the reducer', description: 'Very meta' }];
    const action = {
      type: 'FETCH_TASKS_SUCCEEDED',
      payload: { tasks: taskList },
    };
    const expectedState = { ...initialState, tasks: taskList };

    expect(tasks(initialState, action)).toEqual(expectedState);
  });
});
