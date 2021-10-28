import tasks from '../reducers';

// ch[9.3.0] testing reducers, begin with setting the initial state
// [9.3.1] test for each action case in a switch statement
// [9.3.2] flow the action through the reducer,
// [9.3.3] verify that the final expected state KEY: expect(reducer(state, action).toEqual(newState))


describe('reducer', () => {
  const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
    searchTerm: '',
  };

  // [9.3.1] test the initial state
  it('returns initialState', () => {
    expect(tasks(undefined, {})).toEqual(initialState);
  });

  // [9.3.1] test each of the action cases
  it('FETCH_TASKS_STARTED', () => {
    const action = { type: 'FETCH_TASKS_STARTED' };
    const expectedState = { ...initialState, isLoading: true };
    // [9.3.2] [9.3.3] flow the action through the reducer, verify that the final state is different
    expect(tasks(initialState, action)).toEqual(expectedState);
  });

  it('FETCH_TASKS_SUCCEEDED', () => {
    const taskList = [{ title: 'Test the reducer', description: 'Very meta' }];
    const action = {
      type: 'FETCH_TASKS_SUCCEEDED',
      payload: { tasks: taskList, isLoading: false },
    };
    const expectedState = { ...initialState, tasks: taskList, isLoading: false };

    expect(tasks(initialState, action)).toEqual(expectedState);
  });
});
