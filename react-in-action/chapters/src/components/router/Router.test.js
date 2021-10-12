import React from "react";
import renderer from "react-test-renderer";
import Route from "../../../src/components/router/Route";
import Router from "../../../src/components/router/Router";

// [9.3] testing router
// (9.3.1) create 3 stubs: Root, Found, NotFound
// (9.3.2) cover render tests for found, not found and root
const RootComponentStub = ({ children }) => <div>{children}</div>;
const FoundComponentStub = ({ children }) => <div classNam="found">found</div>;
const NotFoundComponentStub = ({ children }) => (
  <div className="not-found">not found</div>
);

describe("<Route/>", () => {
  test("should render components that match a route", () => {
    const component = renderer.create(
      <Router location={"/a"}>
        <Route component={FoundComponentStub} path="/a" />
        <Route component={FoundComponentStub} path="/b" />
      </Router>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("should render the right component when using a root component", () => {
    const component = renderer.create(
      <Router location={"/a"}>
        <Route path="/" component={RootComponentStub} />
        <Route component={FoundComponentStub} path="a" />
        <Route component={FoundComponentStub} path="b" />
      </Router>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should render a NotFound route', () => {
    const component = renderer.create(
        <Router location={'/not-found'}>
            <Route component={FoundComponentStub} path="/a" />
            <Route component={NotFoundComponentStub} path="*" />
        </Router>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
});
