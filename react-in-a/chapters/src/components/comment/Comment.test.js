import React from 'react';
import renderer from 'react-test-renderer';
import Comment from '../../../src/components/comment/Comment';

describe('<Comment/>', () => {
  test('should render correctly', () => {

    const mockCommentProps = {
      content: 'comment-content',
      user: {
        name: 'comment-user-name',
        profilePicture: 'comment-user-profile-picture'
      },
      date: new Date().getTime(),
      likes: 10
    };

    const component = renderer.create(<Comment comment={mockCommentProps}/>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
