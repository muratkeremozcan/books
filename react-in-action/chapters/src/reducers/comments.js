import initialState from "../constants/initialState";
import * as types from "../constants/types";

// ch[11.0] Reducers are pure functions that receive the previous state and an action as arguments and return the next state.

/** responsible for controlling comments */
export function comments(state = initialState.comments, action) {
  switch (action.type) {
    case types.comments.GET: {
      const { comments } = action;
      // Make a copy of the old state
      let nextState = Object.assign({}, state);
      // add the comments we don't already have
      // For each of our incoming comments, see if we have them in our map yet or not;
      // if they are missing, add them in. JS Maps can be read out in insertion order,
      // so we should still get comments in the order that we got them back from the API
      for (let comment of comments) {
        if (!nextState[comment.id]) {
          nextState[comment.id] = comment;
        }
      }
      return nextState;
    }
    case types.comments.CREATE: {
      const { comment } = action;
      let nextState = Object.assign({}, state);
      nextState[comment.id] = comment;
      return nextState;
    }
    default:
      return state;
  }
}

/**
 * The commentIds reducer is where we keep track of the ids of comments; this way, we can de-normalize our data
 * and treat state more like a database. This way, all we need to do is look things up by ID and leave the
 * rest of the logic to the comments reducer. This allows for better separation of concerns, although different
 * situations lead to you take a different approach                         next state for slice
 */
export function commentIds(state = initialState.commentIds, action) {
  switch (action.type) {
    case types.comments.GET: {
      const nextCommentIds = action.comments.map(comment => comment.id);
      // make a copy of the old state
      let nextState = Array.from(state);
      // populate the comments for nextState
      for (let commentId of nextCommentIds) {
        if (!state.includes(commentId)) {
          nextState.push(commentId);
        }
      }
      return nextState;
    }
    // add a new id
    case types.comments.CREATE: {
      const { comment } = action;
      let nextState = Array.from(state);
      nextState.push(comment.id);
      return nextState;
    }
    default:
      return state;
  }
}
