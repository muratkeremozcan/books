jest.mock("../../src/shared/http");
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import initialState from "../../src/constants/initialState";
import * as types from "../../src/constants/types";
import {
  showComments,
  toggleComments,
  updateAvailableComments,
  createComment,
  getCommentsForPost
} from "../../src/actions/comments";
import * as API from "../../src/shared/http";

// [10.5] testing actions
// to accommodate async actions, use redux-mock-store
// we do not need it for testing actions that just return an object with type and payload information
const mockStore = configureStore([thunk]);

describe("login actions", () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });
  test("showComments", () => {
    const postId = "id";
    const actual = showComments(postId);
    const expected = { type: types.comments.SHOW, postId };

    expect(actual).toEqual(expected);
  });
  test("toggleComments", () => {
    const postId = "id";
    const actual = toggleComments(postId);
    const expected = { type: types.comments.TOGGLE, postId };

    expect(actual).toEqual(expected);
  });
  test("updateAvailableComments", () => {
    const comments = ["comments"];
    const actual = updateAvailableComments(comments);
    const expected = { type: types.comments.GET, comments };

    expect(actual).toEqual(expected);
  });
  test("createComment", async () => {
    const mockComment = { content: "great post!" };
    // this is the template jest mock of promises that we often use
    API.createComment = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve([mockComment])
      });
    });
    // the store dispatches the actions and also gets them
    const actions = store.getActions();
    await store.dispatch(createComment(mockComment));

    const expectedActions = [
      { type: types.comments.CREATE, comment: [mockComment] }
    ];
    expect(actions).toEqual(expectedActions);
  });
  test("getCommentsForPost", async () => {
    const postId = "id";
    const comments = [{ content: "great stuff" }];
    API.fetchCommentsForPost = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve(comments)
      });
    });
    const actions = store.getActions();
    await store.dispatch(getCommentsForPost(postId));

    const expectedActions = [{ type: types.comments.GET, comments }];
    expect(actions).toEqual(expectedActions);
  });
});
