jest.mock('mapbox'); // (9.2.0) if the component, or one of the child components import external modules, mock out that module
import React from 'react';
import renderer from 'react-test-renderer';

import LocationTypeAhead from './LocationTypeAhead';

describe('LocationTypeAhead', () => {
  test('snapshot', () => {
    // (9.2.1) see where the component is used ( <CompName ... ), verify the properties/static propTypes, mock the properties
    const props = {
      onLocationUpdate: jest.fn(),
      onLocationSelect: jest.fn()
    }
    const component = renderer.create(<LocationTypeAhead {...props} />);
    // const component = renderer.create(<LocationTypeAhead onLocationSelect={jest.fn()} onLocationUpdate={jest.fn()}/>); // same thing
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
