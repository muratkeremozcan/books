import React from "react";
import { render } from "react-dom";

// Data flows one way in React, from parents to children. 
// Children can yield back data to a parent via a callback, but they can’t directly modify the parent’s state, and a parent can’t directly modify a child’s state. 
// Component interaction is done via props instead.

// There are no services in React like Angular 
// if you want components to communicate with each other, you pass props for:
// * Accessing data in the parent (either state or props) 
// * Passing that data to a child component

// stateless/functional component that returns an image
const UserProfile = props =>
  <img src={`https://source.unsplash.com/user/${props.username}`} />;
// you can still specify props
UserProfile.defaultProps = { pagename: 'erondu' };

// stateless/functional component that returns a link
const UserProfileLink = props =>
  <a href={`https://ifelse.io/${props.username}`}>{props.username}</a>

// the parent passes data to children using props ( name )
// the children access that data using props ( username )
const UserCard = props =>
  <div>
    <UserProfileLink username={props.name} />
    <UserProfile username={props.name} />
  </div>

  render(<UserCard name='erondu'/>, document.getElementById('root'));