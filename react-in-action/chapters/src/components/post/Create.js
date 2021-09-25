import PropTypes from "prop-types";
import React from "react";
import Filter from "bad-words";
const filter = new Filter();
import classnames from "classnames";

import DisplayMap from "../map/DisplayMap";
import LocationTypeAhead from "../map/LocationTypeAhead";

// [5.1]
// Working with forms in React: receive events from event handlers, then use data from those events to update state or props
// onChange — This is fired when an input element changes. Access new value using event.target.value.
// onClick — This is fired when an element is clicked. You listen for it

class CreatePost extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.initialState = {
      content: "",
      valid: false,
      showLocationPicker: false,
      location: {
        lat: 34.1535641,
        lng: -118.1428115,
        name: null
      },
      locationSelected: false
    };
    this.state = this.initialState;
    this.filter = new Filter();
    this.handlePostChange = this.handlePostChange.bind(this);
    this.handleRemoveLocation = this.handleRemoveLocation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleLocation = this.handleToggleLocation.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.onLocationUpdate = this.onLocationUpdate.bind(this);
    this.renderLocationControls = this.renderLocationControls.bind(this);
  }

  handlePostChange(event) {
    // event.target is a reference to the DOM element that dispatched the event (in this case textarea element)
    // grab that value and use it to set state
    const content = filter.clean(event.target.value); // this is how you start form sanitation
    this.setState(() => {
      return {
        content,
        valid: content.length <= 280 // this is how you start form validation
      };
    });
  }
  // allow user to remove location from their post
  handleRemoveLocation() {
    this.setState(() => ({
      locationSelected: false,
      location: this.initialState.location
    }));
  }
  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.valid) {
      return;
    }
    const newPost = {
      content: this.state.content
    };
    // when submitting a post, ad location to it if present
    if (this.state.locationSelected) {
      newPost.location = this.state.location;
    }

    // [6.1]
    // make sure there is a property to work with (can make up any name for it, ex: onMurat instead of onSubmit)
    // the prop just looks like an attribute at the component instance which is at the parent: <CreatePost onSubmit../>

    this.props.onSubmit(newPost);
    this.setState(() => ({
      content: "",
      valid: false,
      showLocationPicker: false,
      location: this.initialState.location,
      locationSelected: false
    }));
  }
  // handle a location update from the LocationTypeAhead component
  onLocationUpdate(location) {
    this.setState(() => ({ location }));
  }
  // handle a location update from the LocationTypeAhead component
  onLocationSelect(location) {
    this.setState(() => ({
      location,
      showLocationPicker: false,
      locationSelected: true
    }));
  }
  handleToggleLocation(event) {
    event.preventDefault();
    this.setState(state => ({ showLocationPicker: !state.showLocationPicker }));
  }
  // We can implement a "subrender" method here and not clutter the main render method with tons
  // of conditional logic. This is a helpful pattern to explore when dealing with components that
  // have longer render methods
  renderLocationControls() {
    return (
      <div className="controls">
        <button onClick={this.handleSubmit}>Post</button>
        {this.state.location && this.state.locationSelected ? (
          <button
            onClick={this.handleRemoveLocation}
            className="open location-indicator"
          >
            <i className="fa-location-arrow fa" />
            <small>{this.state.location.name}</small>
          </button>
        ) : (
          <button onClick={this.handleToggleLocation} className="open">
            {this.state.showLocationPicker ? "Cancel" : "Add location"}{" "}
            <i
              className={classnames(`fa`, {
                "fa-map-o": !this.state.showLocationPicker,
                "fa-times": this.state.showLocationPicker
              })}
            />
          </button>
        )}
      </div>
    );
  }
  render() {
    return (
        <div className="create-post">
            <textarea
                value={this.state.content}
                onChange={this.handlePostChange}
                placeholder="What's on your mind?"
            />
            {this.renderLocationControls()}
            <div
                className="location-picker"
                style={{ display: this.state.showLocationPicker ? "block" : "none" }}
            >
                {!this.state.locationSelected && (
                    <LocationTypeAhead
                        onLocationSelect={this.onLocationSelect}
                        onLocationUpdate={this.onLocationUpdate}
                    />
                )}
                <DisplayMap
                    displayOnly={false}
                    location={this.state.location}
                    onLocationSelect={this.onLocationSelect}
                    onLocationUpdate={this.onLocationUpdate}
                />
            </div>
        </div>
    );
}
}

export default CreatePost;

/* Properties and methods available on a synthetic event in React

bubbles         boolean
cancelable      boolean
currentTarget   DOMEventTarget
defaultPrevented boolean
eventPhase      number
isTrusted       boolean
nativeEvent     DOMEvent
preventDefault()
isDefaultPrevented() boolean
stopPropagation()
isPropagationStopped() boolean
target          DOMEventTarget
timeStamp       number
*/
