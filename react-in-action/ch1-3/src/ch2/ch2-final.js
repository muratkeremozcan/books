import React, { Component } from "react";
import { render } from "react-dom";
import PropTypes from "prop-types";

/* 
There are 2 kinds of elements for creating components:

1. React elements
  * comparable to DOM elements
  * can access props.

props— short for properties object, helps specify:
* which attributes will be defined on the HTML element (React DOM element)
* which attributes will be available to a component class instance.

2. React components (what we generally refer to as components)
  * JS classes that inherit from React.component class 
    - created from classes:  class A extends React.Component{ .. }
    - created from functions  (newer and better way, shown later)
  * can access props as well as state (mutable state) - ex: setState(object/fn, callback?)
    * can have custom functions - ex: handleSubmit
  * can access lifecycle methods
    - componentWillMount()
    - componentDidMount()
    - componentWillReceiveProps()  
    - shouldComponentUpdate()
    - componentWillUpdate()
    - componentDidUpdate()
    - componentWillUnmount()
  * can have parent -> child relationships. Children can pass data to parents using callbacks but can't directly access them.
  
  JSX is more readable vs React.createElement calls 
*/
const node = document.getElementById("root");

const data = {
  post: {
    id: 123,
    content:
      "What we hope ever to do with ease, we must first learn to do with diligence. — Samuel Johnson",
    user: "Mark Thomas"
  },
  comments: [
    {
      id: 0,
      user: "David",
      content: "such. win."
    },
    {
      id: 1,
      user: "Haley",
      content: "Love it."
    },
    {
      id: 2,
      user: "Peter",
      content: "Who was Samuel Johnson?"
    },
    {
      id: 3,
      user: "Mitchell",
      content: "@Peter get off Letters and do your homework"
    },
    {
      id: 4,
      user: "Peter",
      content: "@mitchell ok :P"
    }
  ]
};
class Post extends Component {
  render() {
    return (
      <div className="post">
        <h2 className="postAuthor">{this.props.user}</h2>
        <span className="postBody">{this.props.content}</span>
        {this.props.children}
      </div>
    );
  }
}
Post.propTypes = {
  user: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

class Comment extends Component {
  render() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">{this.props.user + " : "}</h2>
        <span className="commentContent">{this.props.content}</span>
      </div>
    );
  }
}

Comment.propTypes = {
  content: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired
};

class CreateComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      user: ""
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUserChange(event) {
    this.setState({
      user: event.target.value
    });
  }
  handleTextChange(event) {
    this.setState({
      content: event.target.value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.onCommentSubmit({
      user: this.state.user.trim(),
      content: this.state.content.trim()
    });
    this.setState({
      user: "",
      content: ""
    });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="createComment">
        <input
          value={this.state.user}
          onChange={this.handleUserChange}
          placeholder="Your name"
          type="text"
        />
        <input
          value={this.state.content}
          onChange={this.handleTextChange}
          placeholder="Thoughts?"
          type="text"
        />
        <button type="submit">Post</button>
      </form>
    );
  }
}

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments
    };
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
  }
  handleCommentSubmit(comment) {
    const comments = this.state.comments;
    comment.id = Date.now();
    const newComments = comments.concat([comment]);
    this.setState({
      comments: newComments
    });
  }
  render() {
    return (
      <div className="commentBox">
        <Post
          id={this.props.post.id}
          content={this.props.post.content}
          user={this.props.post.user}
        />
        {this.state.comments.map(function(comment) {
          return (
            <Comment
              key={comment.id}
              content={comment.content}
              user={comment.user}
            />
          );
        })}
        <CreateComment onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
}

CommentBox.propTypes = {
  post: PropTypes.object,
  comments: PropTypes.arrayOf(PropTypes.object)
};

render(<CommentBox comments={data.comments} post={data.post}/>, node);
