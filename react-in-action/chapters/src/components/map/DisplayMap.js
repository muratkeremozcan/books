import React, { Component } from "react";
import PropTypes from "prop-types";

// ch [6.2]
// A ref is React’s way of giving you access to the underlying DOM node.
// Refs can be useful in React, but you shouldn’t overuse them.
// We still want to use state and props as the primary means for making our apps interactive and for working with data.
// But there are good cases where refs are useful, including the following:
// * To manage focus and imperatively interact with media elements like <video>
// * To imperatively trigger animations
// * To interact with third-party libraries that use the DOM outside of React (this is our use case)
// You can’t use refs in React on a stateless functional component from the outside because that component doesn’t have a backing instance.

// <div ref={ref => { this.MyNode = ref; } }></div>

export default class DisplayMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapLoaded: false,
      location: {
        lat: props.location.lat,
        lng: props.location.lng,
        name: props.location.name
      }
    };

    this.ensureMapExists = this.ensureMapExists.bind(this);
  }

  static propTypes = {
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
      name: PropTypes.string
    }),
    displayOnly: PropTypes.bool
  };

  static defaultProps = {
    displayOnly: true,
    location: {
      lat: 34.1535641,
      lng: -118.1428115,
      name: null
    }
  };

  componentDidMount() {
    this.L = window.L; // some lib that mapBox uses
    // if location info exists, setup the map
    if (this.state.location.lng && this.state.location.lat) {
      this.ensureMapExists();
    }
  }

  // Tell Mapbox to invalidate size of your map, preventing map from displaying incorrectly when hiding/showing it
  componentDidUpdate() {
    if (this.map && !this.props.displayOnly) {
      // See https://www.mapbox.com/mapbox.js/api/v3.1.1/l-map-class/
      this.map.invalidateSize(false);
    }
  }

  // When location to display changes, you need to respond accordingly
  componentWillReceiveProps(nextProps) {
    // If you have a location, check current and previous location to see if properties are the same
    // if not, you can update map
    if (nextProps.location) {
      const locationsAreEqual = Object.keys(nextProps.location).every(
        k => nextProps.location[k] === this.props.location[k]
      );
      if (!locationsAreEqual) {
        this.updateMapPosition(nextProps.location);
      }
    }
  }

  ensureMapExists() {
    if (this.state.mapLoaded) return; // do not recreate if already exists
    // Create new map with Mapbox and store reference to it on component
    this.map = this.L.mapbox.map(this.mapNode, "mapbox.streets", {
      zoomControl: false,
      scrollWheelZoom: false
    });
    this.map.setView(
      this.L.latLng(this.state.location.lat, this.state.location.lng),
      12
    );
    this.addMarker(this.state.location.lat, this.state.location.lng);
    this.setState(() => ({ mapLoaded: true }));
  }

  updateMapPosition(location) {
    const { lat, lng } = location;
    this.map.setView(this.L.latLng(lat, lng));
    this.addMarker(lat, lng);
    this.setState(() => ({ location }));
  }

  addMarker(lat, lng) {
    // IF we have already saved the marker, just update it
    if (this.marker) {
      return this.marker.setLatLng(this.L.latLng(lat, lng));
    }
    // Create a marker and put it on the map
    this.marker = this.L.marker([lat, lng], {
      icon: this.L.mapbox.marker.icon({
        "marker-color": "#4469af"
      })
    });
    this.marker.addTo(this.map);
  }

  generateStaticMapImage(lat, lng) {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${lat},${lng},12,0,0/600x175?access_token=${
      process.env.MAPBOX_API_TOKEN
    }`;
  }

  render() {
    // return an array of elements to display
    return [
      <div key="displayMap" className="displayMap">
        <div
          className="map"
          // DOM element that MapBox will use to display map
          ref={node => {
            this.mapNode = node;
          }}
        >
          {/* display the location image */}
          {!this.state.mapLoaded && (
            <img
              className="map"
              src={this.generateStaticMapImage(
                this.state.location.lat,
                this.state.location.lng
              )}
              alt={this.state.location.name}
            />
          )}
        </div>
      </div>,
      // if you're in display-only mode, show a location name and indicator
      this.props.displayOnly && (
        <div key="location-description" className="location-description">
          <i className="location-icon fa fa-location-arrow" />
          <span className="location-name">{this.state.location.name}</span>
        </div>
      )
    ];
  }
}
