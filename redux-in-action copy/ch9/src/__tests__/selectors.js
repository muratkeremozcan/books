import { getTasks, getSearchTerm, getFilteredTasks } from '../reducers/';
import cloneDeep from 'lodash/cloneDeep';

describe('selectors', () => {
  const state = {
    tasks: {
      tasks: [
        { title: 'Test selectors', description: 'Very meta' },
        { title: 'Learn Redux', description: 'Oh my!' },
      ],
      searchTerm: 'red',
      isLoading: false,
      error: null,
    },
  };

  afterEach(() => {
    getFilteredTasks.resetRecomputations();
  });

  it('getTasks', () => {
    expect(getTasks(state)).toEqual(state.tasks.tasks);
  });

  it('getSearchTerm', () => {
    expect(getSearchTerm(state)).toEqual(state.tasks.searchTerm);
  });

  it('getFilteredTasks', () => {
    const expectedTasks = [{ title: 'Learn Redux', description: 'Oh my!' }];

    expect(getFilteredTasks(state)).toEqual(expectedTasks);
  });

  it('getFilteredTasks recomputes when reducer updates', () => {
    const similarSearch = cloneDeep(state);
    similarSearch.tasks.searchTerm = 'redu';

    const uniqueSearch = cloneDeep(state);
    uniqueSearch.tasks.searchTerm = 'selec';

    expect(getFilteredTasks.recomputations()).toEqual(0);
    getFilteredTasks(state);
    getFilteredTasks(similarSearch);
    expect(getFilteredTasks.recomputations()).toEqual(1);
    getFilteredTasks(uniqueSearch);
    expect(getFilteredTasks.recomputations()).toEqual(2);
  });
});
