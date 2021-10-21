import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './components/Header';
import TasksPage from './components/TasksPage';
import FlashMessage from './components/FlashMessage';
import {
  createTask,
  editTask,
  fetchProjects,
  filterTasks,
  setCurrentProjectId,
} from './actions';
import { getGroupedAndFilteredTasks, getProjects } from './reducers/';

// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -(selector)-> update VIEW

// ch[2.2] connecting a component to Redux
// you took care of the redux boilerplate (2.0)
// you created the actions & action handlers (2.1) 
// now, at a container component, dispatch those actions 
// and create mapStateToProps and mapDispatchToProps, export using connect

// presentational components handle UI and UI-related data (like angular components), ex: TaskPage.js
// container components (App.js) handle application data via Redux (like Angular services).
// container components render presentational components, ex: <TasksPage />
// with this pattern, how the application looks is decoupled from what it does

class App extends Component {
  // ch[4.1] working with the back-end
  // create the async action creators (they return a function that communicates with the back-end) (4.0)
  // in the browser, use componentDidMount lifecycle callback to initiate AJAX requests
  componentDidMount() {
    this.props.dispatch(fetchProjects());
  }

  onCurrentProjectChange = e => {
    this.props.dispatch(setCurrentProjectId(Number(e.target.value)));
  };

  onCreateTask = ({ title, description }) => {
    // actions are handled by container components
    // container components have access to dispatch thanks to connect
    this.props.dispatch(
      createTask({
        title,
        description,
        projectId: this.props.currentProjectId,
      })
    );
  };

  onStatusChange = (task, status) => {
    this.props.dispatch(editTask(task, { status }));
  };

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm));
  };

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <Header
            projects={this.props.projects}
            onCurrentProjectChange={this.onCurrentProjectChange}
          />
          <TasksPage
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onSearch={this.onSearch}
            onStatusChange={this.onStatusChange}
            isLoading={this.props.isLoading}
          />
        </div>
      </div>
    );
  }
}


// To inject state use mapStateToProps(state). It allows to derive data before making it available to the component, using selectors
// * receives state as a parameter
// * returns an object that is merged into the props for the component, making the property available as this.props
function mapStateToProps(state) {
  const { isLoading, error } = state.projects;
  // ch[7.0] Selectors are functions that accept a state from the Redux store and compute data that will be passed as props to React components
  // Data comes out of the store, you run it through selectors, and the view (React, in your case) accepts selector output and takes care of any rendering
  // without selectors, components would be coupled directly to the shape of the Redux store; if the structure of the store changes, you must update every component
  // selectors prevent business logic from piling up inside components and boost performance by forgoing unnecessary renders via memoization.
  return {
    // [8.6] update mapStateToProps using the new selectors
    // generic flow: update actions -> update reducers -> update rootReducer -> update selectors to get data out of the store, use mapStateToProps -> update view
    tasks: getGroupedAndFilteredTasks(state),
    projects: getProjects(state),
    currentProjectId: state.page.currentProjectId,
    isLoading,
    error,
  };
}

// * connect — a function used as a bridge between React components and data from the Redux store.
export default connect(mapStateToProps)(App);
