import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import { Provider } from "react-redux";
import ConnectedApp, { App } from "../App";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

// ch[9.6] testing container components
// (they have connect(mapStateToProps)(ComponentName) at the end)
// they have access to the Redux store: they have props.dispatch, and props made available by mapStateToProps
// [9.6.1] test that dispatch is called on mount (using Enzyme mount) using <CompName dispatch={spy}
// [9.6.2] when testing Redux functionality in a component, mock the store and wrap the component with Provider
// [9.6.3] mount with Enzyme or renderer from "react-test-renderer";
// [9.6.4] test an action and or snapshot

// Note:  you can log the contents of a component to the console.
// The debug method allows you to visualize each element in the virtual DOM:
// console.log(wrapper.debug())
// Use this line within any test to compare the actual DOM elements with your expectations.

describe("the App container", () => {
  // [9.6.1] test that dispatch is called, using <CompName dispatch={spy}
  it("should render a FlashMessage component if there is an error", () => {
    const spy = jest.fn();
    const wrapper = shallow(<App dispatch={spy} error="Boom!" />);

    expect(wrapper.find("FlashMessage").exists()).toBe(true);
  });

  // [9.6.1] test that dispatch is called on mount (using Enzyme mount) using <CompName dispatch={spy}
  it("should dispatch fetchTasks on mount", () => {
    const spy = jest.fn();
    mount(<App dispatch={spy} error="Boom!" tasks={[]} />);

    expect(spy).toHaveBeenCalled();
  });

  it("should fetch tasks on mount", () => {
    const middlewares = [thunk];
    const initialState = {
      tasks: {
        tasks: [],
        isLoading: false,
        error: null,
        searchTerm: "",
      },
    };
    // [9.6.2] when testing Redux functionality in a component, mock the store and wrap the component with Provider
    const mockStore = configureStore(middlewares)(initialState);
    // [9.6.3] mount with Enzyme or renderer from "react-test-renderer";
    mount(
      <Provider store={mockStore}>
        <ConnectedApp />
      </Provider>
    );
    const expectedAction = { type: "FETCH_TASKS_STARTED" };
    // [9.6.4] test an action and or snapshot
    expect(mockStore.getActions()[0]).toEqual(expectedAction);
  });
});
