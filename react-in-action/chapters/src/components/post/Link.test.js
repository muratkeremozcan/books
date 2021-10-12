import React from 'react';
import { shallow } from 'enzyme';

import Link from '../../../src/components/post/Link';

describe('Link', () => {

  test('should render if there is a link', () => {
    const props = {
      link: {
        url: 'https://ifelse.io',
        title: 'Link-title',
        description: 'link-description'
      }
    };
    // (9.1.1) when not using snapshots use Enzyme's shallow method to render the component
    const wrapper = shallow(<Link {...props} />);
    // const wrapper = shallow(<Link link={props.link} />); // same
    // const wrapper = shallow(<Link link={
    //   {
    //     url: 'https://ifelse.io',
    //     title: 'Link-title',
    //     description: 'link-description'}
    // } />); // same
    expect(wrapper.find('.url').text()).toBe('https://ifelse.io');

  });

  test('should render nothing without a link', () => {
    const wrapper = shallow(<Link/>);
    // use wrapper.html() to access the DOM
    expect(wrapper.html()).toBeFalsy();
  });

});
