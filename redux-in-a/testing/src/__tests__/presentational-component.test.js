import React from "react";
import Enzyme, { shallow } from "enzyme";
import TaskList from "../components/TaskList";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";

// ch[9.5] testing presentational components
// they do not have access to the Redux store, they accept props from a parent component and render
// the 2 methods for mounting components are shallow and mount
// mount renders all children components, use shallow until extra fn is required to be tested by mount

Enzyme.configure({ adapter: new Adapter() });

describe("the TaskList component", () => {
  it("should render a status", () => {
    // [9.5.1] mount the component and make assertions (components mounted with Enzyme are called wrapper by convention)
    const wrapper = shallow(<TaskList status="In Progress" tasks={[]} />);
    // enzyme shallow api https://enzymejs.github.io/enzyme/docs/api/shallow.html
    expect(wrapper.find("strong").text()).toEqual("In Progress");
  });

  it("should render a Task component for each task", () => {
    // [9.5.2] find the parent of the presentational component and test the usage of the presentational component itself
    const tasks = [
      { id: 1, title: "A", description: "a", status: "Unstarted", timer: 0 },
      { id: 2, title: "B", description: "b", status: "Unstarted", timer: 0 },
      { id: 3, title: "C", description: "c", status: "Unstarted", timer: 0 },
    ];
    const wrapper = shallow(<TaskList status="Unstarted" tasks={tasks} />);

    expect(wrapper.find("Task").length).toEqual(3);
  });

  it("should match the last snapshot without tasks", () => {
    const wrapper = shallow(<TaskList status="In Progress" tasks={[]} />);
    // [9.5.3] use toJson from "enzyme-to-json" or renderer from "react-test-renderer" for snapshot testing
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should match the last snapshot with tasks", () => {
    const tasks = [
      { id: 1, title: "A", description: "a", status: "Unstarted", timer: 0 },
      { id: 2, title: "B", description: "b", status: "Unstarted", timer: 0 },
      { id: 3, title: "C", description: "c", status: "Unstarted", timer: 0 },
    ];
    const wrapper = shallow(<TaskList status="In Progress" tasks={tasks} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
