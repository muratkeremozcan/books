import React from "react";
import renderer from "react-test-renderer";

import Navigation from "../../../src/components/nav/navbar";

describe("Navigation", () => {
  // (9.2.5) if there is any logic in the component, cover those by varying what drives that logic (the props)
  test("snapshot, user not authenticated", () => {
    const props = {
      user: {
        name: 'username',
        authenticated: false,
        profilePicture: 'pic'
      }
    }

    const navigation = renderer.create(<Navigation {...props}/>).toJSON();
    expect(navigation).toMatchSnapshot();
  });

  test("snapshot, user is authenticated", () => {
    const props = {
      user: {
        name: 'username',
        authenticated: true,
        profilePicture: 'pic'
      }
    }

    const navigation = renderer.create(<Navigation {...props}/>).toJSON();
    expect(navigation).toMatchSnapshot();
  });
});
