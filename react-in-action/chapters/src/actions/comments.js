import * as types from "../constants/types";
import * as API from "../shared/http";
import { createError } from "./error";

export function showComments(postId) {
  return {
    type: types.comments.SHOW,
    postId
  };
}

export function toggleComments(postId) {
  return {
    type: types.comments.TOGGLE,
    postId
  };
}

export function updateAvailableComments(comments) {
  return {
    type: types.comments.GET,
    comments
  };
}

// Create comment from a given payload; return a function instead of a plain object
export function createComment(payload) {
  return dispatch => {
    return API.createComment(payload)
      .then(res => res.json())
      .then(comment => {
        dispatch({
          type: types.comments.CREATE,
          comment
        });
      })
      .catch(err => dispatch(createError(err)));
  };
}

export function getCommentsForPost(postId) {
  return dispatch => {
    return API.fetchCommentsForPost(postId)
      .then(res => res.json())
      .then(comments => dispatch(updateAvailableComments(comments)))
      .catch(err => dispatch(createError(err)));
  };
}
