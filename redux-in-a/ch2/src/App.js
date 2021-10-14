import React, { Component } from 'react';
import { connect } from 'react-redux';
import TasksPage from './components/TasksPage';
import FlashMessage from './components/FlashMessage';
import { createTask, editTask, fetchTasks } from './actions';

// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW

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
    this.props.dispatch(fetchTasks());
  }

  onCreateTask = ({ title, description }) => {
    // actions are handled by container components
    // container components have access to dispatch thanks to connect
    this.props.dispatch(createTask({ title, description }));
  };

  onStatusChange = (id, status) => {
    this.props.dispatch(editTask(id, { status }));
  };

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <TasksPage
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onStatusChange={this.onStatusChange}
            isLoading={this.props.isLoading}
          />
        </div>
      </div>
    );
  }
}

// To inject state use mapStateToProps(state), 
// * receives state as a parameter
// * returns an object that is merged into the props for the component, making the property available as this.props
function mapStateToProps(state) {
  const { tasks, isLoading, error } = state.tasks;
  return { tasks, isLoading, error };
}

// * connect — a function used as a bridge between React components and data from the Redux store.
export default connect(mapStateToProps)(App);
