import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Content from "../../../src/components/post/Content";

// ch[9.1] test presentational components  with shallow rendering
// they do not have access to the Redux store, they accept props from a parent component and render
// the 2 methods for mounting components are shallow and mount
// mount renders all children components, use shallow until extra fn is required to be tested by mount

describe("<Content/>", () => {
  describe("render methods", () => {
    const mockPost = {
      content: "I am learning to test React components"
    };
    test("should render correctly with Enzyme's shallow method", () => {
      // (9.1.1) when not using snapshots use Enzyme's shallow method to render the component
      // the 2 methods for mounting components are shallow and mount
      // mount renders all children components, use shallow until extra fn is required to be tested by mount
      const wrapper = shallow(<Content post={mockPost} />);
      expect(wrapper.find("p").length).toBe(1);
      expect(wrapper.find("p.content").length).toBe(1);
      expect(wrapper.find(".content").text()).toBe(mockPost.content);
      expect(wrapper.find("p").text()).toBe(mockPost.content);
    });
    test("use renderer to create snapshot, and Jest to test it", () => {
      // (9.1.2) when using snapshots, use renderer to create snapshot, and Jest to test it
      const component = renderer.create(<Content post={mockPost} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
