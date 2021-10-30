import React, { Component } from 'react';
import { connect } from 'react-redux';
// a helper for binding dispatch to actions
import { bindActionCreators } from 'redux';
import TaskList from './TaskList';
import { createTask, editTask, filterTasks } from '../actions';
import { getGroupedAndFilteredTaskIds } from '../reducers';

class TasksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewCardForm: false,
      title: '',
      description: '',
    };
  }

  onTitleChange = e => {
    this.setState({ title: e.target.value });
  };

  onDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  resetForm() {
    this.setState({
      showNewCardForm: false,
      title: '',
      description: '',
    });
  }

  toggleForm = () => {
    this.setState({ showNewCardForm: !this.state.showNewCardForm });
  };

  onCreateTask = e => {
    e.preventDefault();

    this.props.createTask({
      title: this.state.title,
      description: this.state.description,
      projectId: this.props.currentProjectId,
    });

    this.resetForm();
  };

  onSearch = e => {
    this.props.onSearch(e.target.value);
  };

  onStatusChange = (task, status) => {
    this.props.editTask(task, { status });
  };

  renderTaskLists() {
    const { taskIds } = this.props;

    return Object.keys(taskIds).map(status => {
      const idsByStatus = taskIds[status];

      return (
        <TaskList
          key={status}
          status={status}
          taskIds={idsByStatus}
          onStatusChange={this.onStatusChange}
        />
      );
    });
  }

  render() {
    if (this.props.isLoading) {
      return <div className="tasks-loading">Loading...</div>;
    }

    return (
      <div className="tasks">
        <div className="tasks-header">
          <input onChange={this.onSearch} type="text" placeholder="Search..." />
          <button className="button button-default" onClick={this.toggleForm}>
            + New task
          </button>
        </div>

        {this.state.showNewCardForm &&
          <form className="new-task-form" onSubmit={this.onCreateTask}>
            <input
              className="full-width-input"
              onChange={this.onTitleChange}
              value={this.state.title}
              type="text"
              placeholder="title"
            />
            <input
              className="full-width-input"
              onChange={this.onDescriptionChange}
              value={this.state.description}
              type="text"
              placeholder="description"
            />
            <button className="button" type="submit">
              Save
            </button>
          </form>}

        <div className="task-lists">{this.renderTaskLists()}</div>
      </div>
    );
  }
}

// [2.2] actions are handled by container components
// container components have access to dispatch thanks to connect
// the container component has to know about state, use mapStateToProps(state) 
// * receives state as a parameter
// * returns an object that is merged into the props for the component, making the property available as this.props
function mapStateToProps(state) {
  const { isLoading } = state.projects;

  // you created selectors (usually in reducer file) (7.1)
  // [7.3] now use the selectors to get state data from the Redux store, derive the data, and pass it as props to the container component
  // [8.6] update mapStateToProps using the new selectors
  // generic flow: update actions -> update reducers -> update rootReducer -> update selectors to get data out of the store, use mapStateToProps -> update view
  return {
    taskIds: getGroupedAndFilteredTaskIds(state),
    currentProjectId: state.page.currentProjectId,
    isLoading,
  };
}

// ch[10.1] performance and structuring the code
// the below function binds dispatch to the actions 
// Instead of using dispatch directly in the component as we did before when dispatching actions
// before: this.props.dispatch(createTask(...)) this.props.dispatch(editTask(...)) this.props.dispatch(actionName(...))
// now we can shorten it: this.props.createTask  this.props.editTask this.props.actionName
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onSearch: filterTasks,
      createTask,
      editTask,
    },
    dispatch
  );
}

// [2.2] connect — a function used as a bridge between React components and data from the Redux store.
// [10.1] connect accepts a second argument, a function conventionally named mapDispatchToProps. 
// connect will pass dispatch as an argument to the mapDispatchToProps function, and allow components to shorten action calls  
export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);