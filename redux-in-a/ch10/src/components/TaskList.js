import React from 'react';
import Task from './Task';

const TaskList = props => {
  return (
    <div className="task-list">
      <div className="task-list-title">
        <strong>{props.status}</strong>
      </div>
      {props.taskIds.map(id => (
        <Task key={id} taskId={id} onStatusChange={props.onStatusChange} />
      ))}
    </div>
  );
};

export default TaskList;
