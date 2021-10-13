import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import TaskList from '../components/TaskList';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('the TaskList component', () => {
  it('should render a status', () => {
    const wrapper = shallow(<TaskList status="In Progress" tasks={[]} />);

    expect(wrapper.find('strong').text()).toEqual('In Progress');
  });

  it('should render a Task component for each task', () => {
    const tasks = [
      { id: 1, title: 'A', description: 'a', status: 'Unstarted', timer: 0 },
      { id: 2, title: 'B', description: 'b', status: 'Unstarted', timer: 0 },
      { id: 3, title: 'C', description: 'c', status: 'Unstarted', timer: 0 },
    ];
    const wrapper = shallow(<TaskList status="Unstarted" tasks={tasks} />);

    expect(wrapper.find('Task').length).toEqual(3);
  });

  it('should match the last snapshot without tasks', () => {
    const wrapper = shallow(<TaskList status="In Progress" tasks={[]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match the last snapshot with tasks', () => {
    const tasks = [
      { id: 1, title: 'A', description: 'a', status: 'Unstarted', timer: 0 },
      { id: 2, title: 'B', description: 'b', status: 'Unstarted', timer: 0 },
      { id: 3, title: 'C', description: 'c', status: 'Unstarted', timer: 0 },
    ];
    const wrapper = shallow(<TaskList status="In Progress" tasks={tasks} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
