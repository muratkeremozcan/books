import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Link from '../../../src/components/router/Link';

// (9.2.0) if the component, or one of the child components import external modules, mock out that module
jest.mock('../../../src/history');

describe('<Link/>', () => {
  // (9.2.6) if a component has child components (if a propType is of PropTypes.node)
  // we need to stub that child component
  const ChildComponentStub = () => <div>inner child</div>;


  test('should return an element with an onClick method attached', () => {
    // (9.1.1) when not using snapshots, use Enzyme's shallow method to render the component,
    // the 2 methods for mounting components are shallow and mount
    // mount renders all children components, use shallow until extra fn is required to be tested by mount
    const wrapper = shallow(
      <Link to='/'>
        <ChildComponentStub />
      </Link>
    );

    expect(wrapper.find(ChildComponentStub).length).toBe(1);
    // user wrapper.props() to access the props of the component
    expect(wrapper.props().onClick).toBeDefined();
  });

  test('should render correctly', () => {
    const component = renderer.create(
        <Link to="/">
            <ChildComponentStub />
        </Link>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
});
