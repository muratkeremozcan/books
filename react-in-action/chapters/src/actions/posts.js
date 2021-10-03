import parseLinkHeader from "parse-link-header";

import * as types from "../constants/types";
import * as API from "../shared/http";
import { createError } from "./error";
import { getCommentsForPost } from "./comments";

// [10.1]
// note that the dispatch operation is done by the store

export function updateAvailablePosts(posts) {
  return {
    type: types.posts.GET,
    posts
  };
}

export function updatePaginationLinks(links) {
  return {
    type: types.posts.UPDATE_LINKS,
    links
  };
}

export function like(postId) {
  return (dispatch, getState) => {
    const { user } = getState(); // use getState to get a snapshot of the current state
    return API.likePost(postId, user.id)
      .then(res => res.json())
      .then(post => {
        dispatch({ // dispatch (from Redux) the action to the reduce
          type: types.posts.LIKE,
          post
        });
      })
      .catch(err => dispatch(createError(err)));
  };
}

export function unlike(postId) {
  return (dispatch, getState) => {
    const { user } = getState();
    return API.unlikePost(postId, user.id)
      .then(res => res.json())
      .then(post => {
        dispatch({
          type: types.posts.UNLIKE,
          post
        });
      })
      .catch(err => dispatch(createError(err)));
  };
}

export function createNewPost(post) {
  return (dispatch, getState) => {
    const { user } = getState();
    post.userId = user.id;
    return API.createPost(post)
      .then(res => res.json())
      .then(newPost => {
        dispatch({
          type: types.posts.CREATE,
          post: newPost
        });
      })
      .catch(err => dispatch(createError(err)));
  };
}

export function getPostsForPage(page = "first") {
  return (dispatch, getState) => {
    const { pagination } = getState();
    const endpoint = pagination[page];
    return API.fetchPosts(endpoint)
      .then(res => {
        const links = parseLinkHeader(res.headers.get("Link"));
        return res.json().then(posts => {
          dispatch(updatePaginationLinks(links));
          dispatch(updateAvailablePosts(posts));
        });
      })
      .catch(err => dispatch(createError(err)));
  };
}

export function loadPost(postId) {
  return dispatch => {
    return API.fetchPost(postId)
      .then(res => res.json())
      .then(post => {
        dispatch(updateAvailablePosts([post]));
        dispatch(getCommentsForPost(postId));
      })
      .catch(err => dispatch(createError(err)));
  };
}
