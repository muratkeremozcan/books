import React, { Component } from "react";
import PropTypes from "prop-types";
import MapBox from "mapbox";

// ch [6.3]
export default class LocationTypeAhead extends Component {
  static propTypes = {
    onLocationUpdate: PropTypes.func.isRequired,
    onLocationSelect: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      locations: [],
      selectedLocation: null,
      error: null
    };
    this.mapbox = new MapBox(process.env.MAPBOX_API_TOKEN);
    this.attemptGeoLocation = this.attemptGeoLocation.bind(this);
    this.handleLocationUpdate = this.handleLocationUpdate.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSelectLocation = this.handleSelectLocation.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.text === '' && prevState.locations.length) {
        this.setState(() => ({ locations: [] }));
    }
  }

  componentWillUnmount() {
    this.resetSearch();
  }

  handleLocationUpdate(location) {
    // when a location is selected, update local component state
    this.setState(() => {
      return {
        text: location.name,
        locations: [],
        selectedLocation: location
      };
    });
    // at the same time, pass location up to parent via props callback
    this.props.onLocationUpdate(location);
  }

  handleSearchChange(e) {
    // pull text off the event you receive when a user types into the search box
    const text = e.target.value;
    this.setState(() => ({ text }));
    if (!text) return;

    // use mapbox to search for locations using user's text
    this.mapbox.geocodeForward(text, {}).then(loc => {
      // don't do anything if no results
      if (!loc.entity.features || !loc.entity.features.length) {
        return;
      }
      // transform mapBox results into a format you can more easily use in the component
      const locations = loc.entity.features.map(feature => {
        const [lng, lat] = feature.center;
        return {
          name: feature.place_name,
          lat,
          lng
        };
      });
      // update the state with the nex locations
      this.setState(() => ({ locations }));
    });
  }
  attemptGeoLocation() {
    if ("geolocation" in navigator) {
      // check if browser supports geolocation
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          // yields coordinates you can use
          const { latitude, longitude } = coords;
          this.mapbox.geocodeReverse({ latitude, longitude }, {}).then(loc => {
            // if nothing is found, return
            if (!loc.entity.features || !loc.entity.features.length) {
              return;
            }

            // get first/closest feature to use
            const feature = loc.entity.features[0];
            const [lng, lat] = feature.center;
            // create a location payload to use and update component state with it
            const currentLocation = {
              name: feature.place_name,
              lat,
              lng
            };
            this.setState(() => ({
              locations: [currentLocation],
              selectedLocation: currentLocation,
              text: currentLocation.name
            }));
            // call handleLocation with new location
            this.handleLocationUpdate(currentLocation);
          });
        },
        null,
        {
          // options to pass geolocation api
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }

  resetSearch() {
    this.setState(() => {
      return {
        text: "",
        locations: [],
        selectedLocation: null
      };
    });
  }
  // when location is selected, pass currently selected location up to the parent (Create component)
  handleSelectLocation() {
    this.props.onLocationSelect(this.state.selectedLocation);
  }

  render() {
    // As of React 16, you can return arrays from Render and no longer need to return
    // a wrapping element (like a div) around everything
    return [
      <div key="location-typeahead" className="location-typeahead">
        <i className="fa fa-location-arrow" onClick={this.attemptGeoLocation} />
        <input
          onChange={this.handleSearchChange}
          type="text"
          placeholder="Enter a location"
          value={this.state.text}
        />
        <button
          disabled={!this.state.selectedLocation}
          onClick={this.handleSelectLocation}
          className="open"
        >
          Select
        </button>
      </div>,

      // if there is a search query and you have results, show the results
      this.state.text.length && this.state.locations.length ? (
        <div
          key="location-typeahead-results"
          className="location-typeahead-results"
        >
          {/* map over the locations you got from Mapbox */}
          {this.state.locations.map(location => {
            return (
              // if user clicks a location, set that to selected location
              <div
                onClick={e => {
                  e.preventDefault();
                  this.handleLocationUpdate(location);
                }}
                // key the components you are iterating over
                key={location.name}
                className="result"
              >
                {/* display location name */}
                {location.name}
              </div>
            );
          })}
        </div>
      ) : null // if there are no locations, don't do anything
    ];
  }
}
