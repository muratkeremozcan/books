import { getTasks, getSearchTerm, getFilteredTasks } from "../reducers";
import cloneDeep from "lodash/cloneDeep";

// ch[9.4.0] testing selectors
// selectors are used to get state data from the Redux store, derive the data, and pass it as props to the React container components
// selectors take a state as input and produce a slice of the state as output.
// selectors are created in the related reducer file, or their own
// they are consumed at the container components mapStateToProps function while getting the data from the store
// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -(selector)-> update VIEW

describe("selectors", () => {
  // [9.4.1] create a mock state for initial state, usually replicates the initial state at the reducer file
  const state = {
    tasks: {
      tasks: [
        { title: "Test selectors", description: "Very meta" },
        { title: "Learn Redux", description: "Oh my!" },
      ],
      searchTerm: "redux",
      isLoading: false,
      error: null,
    },
  };

  // [9.4.2] test the generic selectors
  it("getTasks", () => {
    // expect(getTasks(state)).toEqual(state.tasks.tasks);
    expect(getTasks(state)).toEqual([
      { title: "Test selectors", description: "Very meta" },
      { title: "Learn Redux", description: "Oh my!" },
    ]);
  });

  it("getSearchTerm", () => {
    // expect(getSearchTerm(state)).toEqual(state.tasks.searchTerm);
    expect(getSearchTerm(state)).toEqual("redux");
  });

  // [9.4.2] test the selectors which use reselect library

  // [9.4.2.1] test that the selector returns the desired state output
  it("getFilteredTasks", () => {
    const expectedTasks = [{ title: "Learn Redux", description: "Oh my!" }];

    expect(getFilteredTasks(state)).toEqual(expectedTasks);

    getFilteredTasks.resetRecomputations();
  });

  // [9.4.2.2] test that the reselect library selector is memoizing and limiting the number of recalculations it performs.
  // A helper method, recomputations, is available for this purpose.

  // generic selectors take a state as input and produce a slice of the state as output.
  // reselect selectors perform a similar task but avoid extra work if they can help it.
  // i.e. If the getFilteredTasks function has the same inputs, it won’t bother recalculating the output, instead to return the last stored output.
  it("getFilteredTasks recomputes when reducer updates", () => {
    // prepare state versions to test selector output
    const similarSearch = cloneDeep(state);
    similarSearch.tasks.searchTerm = "redu";

    const uniqueSearch = cloneDeep(state);
    uniqueSearch.tasks.searchTerm = "selec";

    // initially nothing should be memoized
    expect(getFilteredTasks.recomputations()).toEqual(0);
    // verify the selector does minimum number of computations
    getFilteredTasks(state);
    getFilteredTasks(similarSearch);
    expect(getFilteredTasks.recomputations()).toEqual(1);
    // unique searches should be memoized x times
    getFilteredTasks(uniqueSearch);
    expect(getFilteredTasks.recomputations()).toEqual(2);

    getFilteredTasks.resetRecomputations();
  });
});
