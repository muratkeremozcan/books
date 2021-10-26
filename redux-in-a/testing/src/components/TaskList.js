import React from 'react';
import Task from './Task';

// Presentational components do not have access to the Redux store
// they accept props from a parent component, and render
const TaskList = props => {
  return (
    <div className="task-list">
      <div className="task-list-title">
        <strong>{props.status}</strong>
      </div>
      {props.tasks.map(task => (
        <Task key={task.id} task={task} onStatusChange={props.onStatusChange} />
      ))}
    </div>
  );
};

export default TaskList;
