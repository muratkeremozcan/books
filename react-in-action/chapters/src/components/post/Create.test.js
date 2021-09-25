import React from 'react';
import renderer from 'react-test-renderer';
jest.mock('mapbox'); // mock out mapbox module

import CreatePost from '../../../src/components/post/Create';

// [9.2] You import the code under test, mock out any dependencies to isolate your tests to one unit of functionality

describe('CreatePost', () => {
  test('snapshot', () => {
    // { onSubmit: fn } is the props passed to the component, has to be mocked
    const props = { onSubmit: jest.fn()};
    // use renderer to create snapshot, and Jest to test it
    const component = renderer.create(<CreatePost {...props}/>); // {...obj} just duplicates the obj
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('handlePostChange', () => {
    // (9.2.0) property mocking pattern
    const props = { onSubmit: jest.fn()};
    // (9.2.1) event mocking pattern
    const mockEvent = { target: { value: 'test' } };
    // (9.2.2) setState mocking pattern
    CreatePost.prototype.setState = jest.fn(function(updater) {
      this.state = Object.assign(this.state, updater(this.state));
    });

    // (9.2.3) now that we have the mocks, instantiate the component and invoke the function under test
    const component = new CreatePost(props);
    component.handlePostChange(mockEvent)

    // (9.2.4) now we can do assertions
    expect(component.setState).toHaveBeenCalledTimes(1);
    expect(component.state).toEqual({
      content: mockEvent.target.value, // because once we handlePostChange, state has to change
      valid: true, // and valid is set as boolean
      showLocationPicker: false, // the rest are default values from initial state
      location: {
        lat: 34.1535641,
        lng: -118.1428115,
        name: null
      },
      locationSelected: false
    });

  });

  test('handleSubmit', () => {
    // same mocks for props, event and setState
    const props = { onSubmit: jest.fn()};
    const mockEvent = {
      preventDefault: jest.fn(), // here we have to accommodate the event.preventDefault()
      target: { value: 'test' }
    };
    CreatePost.prototype.setState = jest.fn(function(updater) {
      this.state = Object.assign(this.state, updater(this.state));
    });

    // same instantiation
    const component = new CreatePost(props);
    // this time we modify the state (so we can submit something different than the default)
    component.setState(() => ({
      valid: true,
      content: 'cool stuff',
      locationSelected: true // added this to cover the conditional block
    }));
    // same invocation of the function
    component.handleSubmit(mockEvent);

    expect(component.setState).toHaveBeenCalled();
    expect(component.state).toEqual({
      content: '', // because after submit we reset the content
      valid: false, // and we set the state to false
      showLocationPicker: false, // this property is also set to false
      location: { // default values for the rest
        lat: 34.1535641,
        lng: -118.1428115,
        name: null
      },
      locationSelected: false
    })

  });
});
