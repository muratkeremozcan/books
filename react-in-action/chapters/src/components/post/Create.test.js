// [9.2] You import the code under test, mock out any dependencies to isolate your tests to one unit of functionality
import React from "react";
import renderer from "react-test-renderer";
jest.mock("mapbox"); // (9.2.0) if the component, or one of the child components import external modules, mock out that module

import CreatePost from "../../../src/components/post/Create";

// (9.2.1) see where the component is used ( <CompName ... ), verify the properties/static propTypes, mock the properties
// (9.2.2) mock the event if there is an event being passed to the fn
// (9.2.3) instantiate the component and invoke the fn
// (9.2.4) make assertions
  // (9.2.5) if there is any logic in the component, cover those by varying what drives that logic (the props)

describe("CreatePost", () => {
  test("snapshot render", () => {
    // { onSubmit: fn } is the props passed to the component, has to be mocked
    const props = { onSubmit: jest.fn() };

    // use renderer to create snapshot, and Jest to test it
    // ...props to de-structure the props object, { } to wrap it in react syntax
    const component = renderer.create(<CreatePost {...props} />);
    // same thing
    // const component = renderer.create(<CreatePost onSubmit={jest.fn()} />);;

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("handlePostChange", () => {
    // (9.2.0) property mocking pattern
    const props = { onSubmit: jest.fn() };
    // (9.2.1) event mocking pattern
    const mockEvent = { target: { value: "test" } };
    // (9.2.2) setState mocking pattern
    CreatePost.prototype.setState = jest.fn(function(updater) {
      this.state = Object.assign(this.state, updater(this.state));
    });

    // (9.2.3) now that we have the mocks, instantiate the component and invoke the fn  under test
    const component = new CreatePost(props);
    component.handlePostChange(mockEvent);

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

  test("handleSubmit", () => {
    // same mocks for props, event and setState
    const props = { onSubmit: jest.fn() };
    const mockEvent = {
      preventDefault: jest.fn(), // here we have to accommodate the event.preventDefault()
      target: { value: "test" }
    };
    CreatePost.prototype.setState = jest.fn(function(updater) {
      this.state = Object.assign(this.state, updater(this.state));
    });

    // same instantiation
    const component = new CreatePost(props);
    // this time we modify the state (so we can submit something different than the default)
    component.setState(() => ({
      valid: true,
      content: "cool stuff",
      locationSelected: true // added this to cover the conditional block
    }));
    // same invocation of the function
    component.handleSubmit(mockEvent);

    expect(component.setState).toHaveBeenCalled();
    expect(component.state).toEqual({
      content: "", // because after submit we reset the content
      valid: false, // and we set the state to false
      showLocationPicker: false, // this property is also set to false
      location: {
        // default values for the rest
        lat: 34.1535641,
        lng: -118.1428115,
        name: null
      },
      locationSelected: false
    });
  });

  test("handleRemoveLocation", () => {
    // same mocks for props and setState, no event here
    const props = { onSubmit: jest.fn() };
    CreatePost.prototype.setState = jest.fn(function(updater) {
      this.state = Object.assign(this.state, updater(this.state));
    });

    // same instantiation & invocation
    const component = new CreatePost(props);
    // locationSelected is false by default, we need to test that it changes
    component.setState(() => ({
      locationSelected: true
    }));
    component.handleRemoveLocation();

    expect(component.state.locationSelected).toEqual(false);
    expect(component.state.location).toEqual({
      lat: 34.1535641,
      lng: -118.1428115,
      name: null
    });
  });

  test("onLocationUpdate", () => {
    // same mocks for props and setState, no event here
    const props = { onSubmit: jest.fn() };
    CreatePost.prototype.setState = jest.fn(function(updater) {
      this.state = Object.assign(this.state, updater(this.state));
    });

    // same instantiation & invocation
    const component = new CreatePost(props);
    // initial state does not matter, only what it gets updated matters. Use non-defaults
    component.onLocationUpdate({
      name: "what a name",
      lat: 1,
      lng: 2
    });

    expect(component.state.location).toEqual({
      name: "what a name",
      lat: 1,
      lng: 2
    });
  });

  test("handleToggleLocation", () => {
    // same mocks for props, event and setState
    const props = { onSubmit: jest.fn() };
    const mockEvent = {
      preventDefault: jest.fn() // here we have to accommodate the event.preventDefault()
    };
    CreatePost.prototype.setState = jest.fn(function(updater) {
      this.state = Object.assign(this.state, updater(this.state));
    });

    // same instantiation & invocation
    const component = new CreatePost(props);
    component.handleToggleLocation(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    // this fn toggles the default property from false to true
    expect(component.state.showLocationPicker).toEqual(true);
  });

  test("onLocationSelect", () => {
    const props = { onSubmit: jest.fn() };
    CreatePost.prototype.setState = jest.fn(function(updater) {
      this.state = Object.assign(this.state, updater(this.state));
    });

    // same instantiation & invocation
    const component = new CreatePost(props);
    // initial state does not matter, only what it gets updated matters. Use non-defaults
    const loc = {
      name: "what a name",
      lat: 1,
      lng: 2
    };

    component.onLocationUpdate(loc);

    expect(component.state.location).toEqual(loc);
  });
});
