import React from 'react';
import Ad from '../../../src/components/ad/Ad';
import renderer from 'react-test-renderer';

describe('<Ad/>', () => {
  // test('basic render', () => {
  //   // use renderer to create snapshot, and Jest to test it
  //   const component = renderer.create(<Ad />);
  //   const tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  test('should display a link and img', () => {
    // you can pass the Component.propTypes for a full test
    const expectedUrl = 'https://ifelse.io/book';
    const expectedImageURL = '/static/assets/ads/ria.png';
    const component = renderer.create(<Ad url={expectedUrl} imageUrl={expectedImageURL} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
