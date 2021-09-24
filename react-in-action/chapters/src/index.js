import React from 'react';
import { render } from 'react-dom';
import firebase from 'firebase';

import * as API from './shared/http';
import { history } from './history';
import Route from './components/router/Route';
import Router from './components/router/Router';
import App from './app';
import Home from './pages/home';
import SinglePost from './pages/post';
import Login from './pages/login';
import NotFound from './pages/404';
import { getFirebaseToken } from './backend/auth';

import './shared/crash';
import './shared/service-worker';
import './shared/vendor';
// NOTE: this isn't ES*-compliant/possible, but works because we use Webpack as a build tool
import './styles/styles.scss';

// wraps React DOM's render method to pass location state and callback
export const renderApp = (state, callback = () => {}) => {
  render(
    <Router {...state}>
            <Route path="" component={App}>
                <Route path="/" component={Home} />
                <Route path="/posts/:postId" component={SinglePost} />
                <Route path="/login" component={Login} />
                <Route path="*" component={NotFound} />
      </Route>
    </Router>,
    document.getElementById('app'),
    callback
  );
};

// state object to keep track of location and user
let state = {
  location: window.location.pathname,
  user: {
    authenticated: false,
    profilePicture: null,
    id: null,
    name: null,
    token: null
  }
};

// Render the app initially
renderApp(state);

// Fire when location changes and update router,
// causing application to re-render with new state data
history.listen(location => {
  const user = firebase.auth().currentUser;
  state = Object.assign({}, state, {
    location: user ? location.pathname : '/login'
  });
  renderApp(state);
});

firebase.auth().onAuthStateChanged(async user => {
  if (!user) {
    state = {
      location: state.location,
      user: {
        authenticated: false
      }
    };
    return renderApp(state, () => {
      history.push('/login');
    });
  }
  const token = await getFirebaseToken();
  // try to load user from our api
  const res = await API.loadUser(user.uid);
  let renderUser;
  // if no user, sign them up
  if (res.status === 404) {
    const userPayload = {
      name: user.displayName,
      profilePicture: user.photoURL,
      id: user.uid
    };
    // sand request to API and use the response
    renderUser = await API.createUser(userPayload).then(res => res.json());
  } else {
    // if there is a user, use them for rendering the app
    renderUser = await res.json();
  }
  history.push('/');
  // update the app state
  state = Object.assign({}, state, {
    user: {
      name: renderUser.name,
      id: renderUser.id,
      profilePicture: renderUser.profilePicture,
      authenticated: true
    },
    token
  });
  // render app with new state
  renderApp(state);
});
