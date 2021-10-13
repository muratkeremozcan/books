import React from 'react';
import renderer from 'react-test-renderer';

import DisplayMap from '../../../src/components/map/DisplayMap';

describe('DisplayMap', () => {
  test('snapshot does not display map', () => {

    const props = {
      displayOnly: false,
      onLocationSelect: jest.fn(),
      onLocationUpdate: jest.fn()
    };
    const component = renderer.create(
      <DisplayMap {...props}/>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('snapshot displays map', () => {
    const props = {
      displayOnly: true,
      location: {
        lat: 34.1535641,
        lng: -118.1428115,
        name: 'location is here'
      },
      onLocationSelect: jest.fn(),
      onLocationUpdate: jest.fn()
    };
    const component = renderer.create(
      <DisplayMap {...props}/>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
