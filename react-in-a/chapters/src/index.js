import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Firebase from "firebase";

import * as API from "./shared/http";
import { history } from "./history";
import configureStore from "./store/configureStore";
import initialReduxState from "./constants/initialState";
import Route from "./components/router/Route";
import Router from "./components/router/Router";
import App from "./app";
import Home from "./pages/home";
import SinglePost from "./pages/post";
import Login from "./pages/login";
import NotFound from "./pages/404";
import { createError } from "./actions/error";
import { loginSuccess } from "./actions/auth";
import { loaded, loading } from "./actions/loading";
import { getFirebaseUser, getFirebaseToken } from "./backend/auth";

import "./shared/crash";
import "./shared/service-worker";
import "./shared/vendor";
// NOTE: this isn't ES*-compliant/possible, but works because we use Webpack as a build tool
import "./styles/styles.scss";

import "./store/exampleUse";
// const store = configureStore(initialReduxState)

// [11.3] presentational components handle UI and UI-related data (like angular components),
// and container components handle application data via Redux (like Angular services).

// Create the Redux store using initial state
const store = configureStore(initialReduxState);

// wraps React DOM's render method to pass location state and callback
// wrap the router with Provider from react-redux ans set store
const renderApp = (state, callback = () => {}) => {
  render(
    <Provider store={store}>
      <Router {...state}>
        <Route path="" component={App}>
          <Route path="/" component={Home} />
          <Route path="/posts/:postId" component={SinglePost} />
          <Route path="/login" component={Login} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById("app"),
    callback
  );
};

const initialState = {
  location: window.location.pathname
};

// Render the app initially
renderApp(initialState);

// Fire when location changes and update router,
// causing application to re-render with new state data
history.listen(location => {
  const user = Firebase.auth().currentUser;
  const newState = Object.assign(initialState, {
    location: user ? location.pathname : "/login"
  });
  renderApp(newState);
});

getFirebaseUser()
  .then(async user => {
    if (!user) {
      return history.push("/login");
    }
    // get user and dispatch loading action
    store.dispatch(loading());
    const token = await getFirebaseToken();
    // try to load user from our api
    const res = await API.loadUser(user.uid);
    // if no user, sign them up
    if (res.status === 404) {
      const userPayload = {
        name: user.displayName,
        profilePicture: user.photoURL,
        id: user.uid
      };
      // create the new user and dispatch actions to change state
      const newUser = await API.createUser(userPayload).then(res => res.json());
      store.dispatch(loginSuccess(newUser, token));
      store.dispatch(loaded());
      history.push("/");
      return newUser;
    }
    // if there is a user, and do the similar dispatch action
    const existingUser = await res.json();
    store.dispatch(loginSuccess(existingUser, token));
    store.dispatch(loaded());
    history.push("/");
    return existingUser;
  })
  .catch(err => createError(err));
