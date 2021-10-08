import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import orderBy from "lodash/orderBy"; // used to order posts

import { createError } from "../actions/error";
import { createNewPost, getPostsForPage } from "../actions/posts";
import { showComments } from "../actions/comments";
import Ad from "../components/ad/Ad";
import CreatePost from "../components/post/Create";
import Post from "../components/post/Post";
import Welcome from "../components/welcome/Welcome";

// [11.4] connecting a component to Redux:
// create mapStateToProps and mapDispatchToProps, export using connect

export class Home extends Component {
  // load posts when component loads
  componentDidMount() {
    this.props.actions.getPostsForPage();
  }
  // if error occurs, dispatch the error to the store
  componentDidCatch(err, info) {
    this.props.actions.createError(err, info);
  }
  render() {
    return (
      <div className="home">
        <Welcome />
        <div>
          {/* pass in post creation to CreatePost */}
          <CreatePost onSubmit={this.props.actions.createNewPost} />
          {this.props.posts && (
            <div className="posts">
              {/* map over posts, pass in post.id and post */}
              {this.props.posts.map(post => (
                <Post
                  key={post.id}
                  post={post}
                  // showComments via props
                  openCommentsDrawer={this.props.actions.showComments}
                />
              ))}
            </div>
          )}
          <button
            className="block"
            // load more posts
            onClick={this.props.actions.getNextPageOfPosts}
          >
            Load more posts
          </button>
        </div>
        <div>
          <Ad
            url="https://ifelse.io/book"
            imageUrl="/static/assets/ads/ria.png"
          />
          <Ad
            url="https://ifelse.io/book"
            imageUrl="/static/assets/ads/orly.jpg"
          />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.shape({
    createNewPost: PropTypes.func,
    getPostsForPage: PropTypes.func,
    showComments: PropTypes.func,
    createError: PropTypes.func,
    getNextPageOfPosts: PropTypes.func
  })
};

// To inject state, you’ll pass a function (mapStateToProps) that will receive state as a parameter
// and will return an object that will be merged into the props for the component;
// react-redux will re-invoke this function whenever the component receives new props.
export const mapStateToProps = state => {
  const posts = orderBy(
    state.postIds.map(postId => state.posts[postId]),
    "date",
    "desc"
  );
  return {
    posts
  };
};

// gets invoked by connect (from react-redux) and the resulting object will be merged into the props of the component
// use it to set up your action creators and make them available to your component.
export const mapDispatchToProps = dispatch => {
  return {
    // bindActionCreators utility transforms an object whose values are action creators into an object with identical keys
    // with the difference being that every action creator is wrapped in a dispatch call, so they may be invoked directly.
    actions: bindActionCreators(
      {
        createNewPost,
        getPostsForPage,
        showComments,
        createError,
        getNextPageOfPosts: getPostsForPage.bind(this, "next") // bind ensures getPostsForPage action is called with 'next' arg every time
      },
      dispatch
    )
  };
};

// in the index.js file, the store is available to all components (remember <Provider store={store}> )
// now react-redux will inject store state into your components as props and change those props when the store gets updated.
// To make this happen, you need to use the connect utility from react-redux.
// It will generate a container component that’s connected to the Redux store and apply updates when the store changes.
export default connect(
  mapStateToProps, // injects state
  mapDispatchToProps // pulls in the actions bind them to the component
)(Home);
