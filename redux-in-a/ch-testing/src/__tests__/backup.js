import { getTasks, getSearchTerm, getFilteredTasks } from '../reducers';
import cloneDeep from 'lodash/cloneDeep';

// ch[9.4.0] testing selectors
// selectors are used to get state data from the Redux store, derive the data, and pass it as props to the React container components
// selectors are created in the related reducer file, or their own
// they are consumed at the container components mapStateToProps function while getting the data from the store
// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -(selector)-> update VIEW


describe('selectors', () => {
  // [9.4.1] create a mock state for initial state, usually replicates the initial state at the reducer file
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
  
  // [9.4.2] test generic selectors
  it('getTasks', () => {
    // expect(getTasks(state)).toEqual(state.tasks.tasks);
    expect(getTasks(state)).toEqual([
      { title: 'Test selectors', description: 'Very meta' },
      { title: 'Learn Redux', description: 'Oh my!' },
    ]);
  });

  it('getSearchTerm', () => {
    // expect(getSearchTerm(state)).toEqual(state.tasks.searchTerm);
    expect(getSearchTerm(state)).toEqual('red');
  });

  // [9.4.2] test the selectors which use reselect library
  // it('getFilteredTasks', () => {
  //   const searchTerm = 'red';
  //   const expectedTasks = [{ title: 'Learn Redux', description: 'Oh my!' }];

  //   expect(getFilteredTasks(getTasks(state), searchTerm)).toEqual(expectedTasks);
  // });

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
