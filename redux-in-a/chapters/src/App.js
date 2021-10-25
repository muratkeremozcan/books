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

// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> container component gets state data out of STORE through selectors -> VIEW is updated
// generic flow: update actions -> update reducers -> update rootReducer -> update selectors to get data out of the store, use mapStateToProps -> update view

// ch[2.2] connecting a component to Redux.
// Actions are used by container components, which dispatch them to reducers
// you took care of the redux boilerplate (2.0)
// you created the actions & action handlers (2.1) 
// now, at a container component, dispatch those actions 
// the container component has to know about state, so use mapStateToProps
// bridge the component and Redux using connect

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
    // [2.2] actions are handled by container components
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


// [2.2] the container component has to know about state, use mapStateToProps(state) 
// * receives state as a parameter
// * returns an object that is merged into the props for the component, making the property available as this.props
function mapStateToProps(state) {
  const { isLoading, error } = state.projects;
  // you created selectors (usually in reducer file) (7.1)
  // [7.2] now use the selectors to get state data from the Redux store, derive the data, and pass it as props to the React container components
  // [8.6] update mapStateToProps using the new selectors
  // generic flow: update actions -> update reducers -> update rootReducer -> update selectors to get data out of the store, use mapStateToProps -> update view
  return {
    tasks: getGroupedAndFilteredTasks(state),
    projects: getProjects(state),
    currentProjectId: state.page.currentProjectId,
    isLoading,
    error,
  };
}

// [2.2] connect — a function used as a bridge between React components and data from the Redux store.
export default connect(mapStateToProps)(App);
