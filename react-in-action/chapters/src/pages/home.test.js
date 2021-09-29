jest.mock("mapbox");
import React from "react";
import renderer from "react-test-renderer";

import { Home } from "../../src/pages/home";

const now = new Date().getTime();

describe("Single post page", () => {
  test("should render posts", function() {
    // does absolutely nothing because these props do not even match the home component
    // const props = {
    //   posts: [
    //     { id: 1, content: "stuff", likes: [], date: now },
    //     { id: 2, content: "stuff", likes: [], date: now }
    //   ],
    //   actions: {
    //     getPosts: jest.fn(),
    //     createNewPost: jest.fn(),
    //   }
    // };
    // const component = renderer.create(<Home {...props} />); // props here are useless
    const component = renderer.create(<Home />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
