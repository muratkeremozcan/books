import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Content from "../../../src/components/post/Content";

// ch[9.1] test with shallow rendering
describe("<Content/>", () => {
  describe("render methods", () => {
    const mockPost = {
      content: "I am learning to test React components"
    };
    test("should render correctly with Enzyme's shallow method", () => {
      // use Enzyme's shallow method to render the component
      const wrapper = shallow(<Content post={mockPost} />);
      expect(wrapper.find("p").length).toBe(1);
      expect(wrapper.find("p.content").length).toBe(1);
      expect(wrapper.find(".content").text()).toBe(mockPost.content);
      expect(wrapper.find("p").text()).toBe(mockPost.content);
    });
    test("use renderer to create snapshot, and Jest to test it", () => {
      // use renderer to create snapshot, and Jest to test it
      const component = renderer.create(<Content post={mockPost} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
