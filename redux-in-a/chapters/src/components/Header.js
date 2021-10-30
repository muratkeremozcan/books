import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentProjectId } from '../actions';
import { getProjects } from '../reducers/';

class Header extends Component {

  /** dispatch an action on selecting a new project */
  onCurrentProjectChange = e => {
    this.props.setCurrentProjectId(Number(e.target.value));
  };

  render() {
    const projectOptions = this.props.projects.map(project => (
      <option key={project.id} value={project.id}>
        {project.name}
      </option>
    ));

    return (
      <div className="project-item">
        Project:
        <select onChange={this.onCurrentProjectChange} className="project-menu">
          {projectOptions}
        </select>
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
  return {
    // you created selectors (usually in reducer file) (7.1)
    // [7.3] now use the selectors to get state data from the Redux store, derive the data, and pass it as props to the container components
    // [8.6] update mapStateToProps using the new selectors
    // generic flow: update actions -> update reducers -> update rootReducer -> update selectors to get data out of the store, use mapStateToProps -> update view
    projects: getProjects(state),
  };
}

export default connect(mapStateToProps, { setCurrentProjectId })(Header);
