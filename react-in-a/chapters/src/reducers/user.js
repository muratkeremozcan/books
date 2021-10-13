import Cookies from "js-cookie";

import initialState from "../constants/initialState";
import * as types from "../constants/types";

/** responsible next state */
export function user(state = initialState.user, action) {
  switch (action.type) {
    case types.auth.LOGIN_SUCCESS:
      const { user, token } = action; // pull user and token from action
      Cookies.set("letters-token", token); // set cookie with token
      return Object.assign({}, state.user, { // return copy of state with new user data, including token
        authenticated: true,
        name: user.name,
        id: user.id,
        profilePicture: user.profilePicture || "/static/assets/users/4.jpeg",
        token
      });
    case types.auth.LOGOUT_SUCCESS:
      Cookies.remove("letters-token");
      return initialState.user;
    default:
      return state;
  }
}
