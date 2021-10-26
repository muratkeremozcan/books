jest.mock("mapbox");
import React from "react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";

import {
  Home,
  mapStateToProps,
  mapDispatchToProps
} from "../../src/pages/home";
import configureStore from "../../src/store/configureStore";
import initialState from "../../src/constants/initialState";

// ch[9.4] testing container components
// (they have connect(mapStateToProps)(ComponentName) at the end)
// they have access to the Redux store: they have props.dispatch, and props made available by mapStateToProps
// [9.4.1] test that dispatch is called on mount (using Enzyme mount) using <CompName dispatch={spy}
// [9.4.2] when testing Redux functionality in a component, mock the store and wrap the component with Provider
// [9.4.3] mount with Enzyme or renderer from "react-test-renderer";
// [9.4.4] test an action and or snapshot

// Note:  you can log the contents of a component to the console.
// The debug method allows you to visualize each element in the virtual DOM:
// console.log(wrapper.debug())
// Use this line within any test to compare the actual DOM elements with your expectations.

const now = new Date().getTime();
describe("Single post page", () => {
  const state = Object.assign({}, initialState, {
    posts: {
      2: { content: "stuff", likes: [], date: now },
      1: { content: "stuff", likes: [], date: now }
    },
    postIds: [1, 2]
  });
  const store = configureStore(state);
  test("mapStateToProps", () => {
    expect(mapStateToProps(state)).toEqual({
      posts: [
        { content: "stuff", likes: [], date: now },
        { content: "stuff", likes: [], date: now }
      ]
    });
  });
  test("mapDispatchToProps", () => {
    const dispatchStub = jest.fn();
    const mappedDispatch = mapDispatchToProps(dispatchStub);
    expect(mappedDispatch.actions.createNewPost).toBeDefined();
    expect(mappedDispatch.actions.getPostsForPage).toBeDefined();
    expect(mappedDispatch.actions.showComments).toBeDefined();
    expect(mappedDispatch.actions.createError).toBeDefined();
    expect(mappedDispatch.actions.getNextPageOfPosts).toBeDefined();
  });
  test("should render posts", function() {
    const props = {
      posts: [
        { id: 1, content: "stuff", likes: [], date: now },
        { id: 2, content: "stuff", likes: [], date: now }
      ],
      actions: {
        getPostsForPage: jest.fn(),
        createNewPost: jest.fn(),
        createError: jest.fn(),
        showComments: jest.fn()
      }
    };
    const component = renderer.create(
      <Provider store={store}>
        <Home {...props} />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
