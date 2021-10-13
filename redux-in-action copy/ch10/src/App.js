import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './components/Header';
import TasksPage from './components/TasksPage';
import FlashMessage from './components/FlashMessage';
import { fetchProjects } from './actions';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchProjects());
  }

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <Header />
          <TasksPage />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { error } = state.projects;

  return { error };
}

export default connect(mapStateToProps)(App);
