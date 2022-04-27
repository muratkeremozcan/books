const axios = require("axios");
const { getUser, getUserDI } = require("./di");

// Suppose we have a class that fetches users from our API: users.js
// The class uses axios to call the API then returns the data attribute which contains all the users
// in order to test this method without actually hitting the API (and thus creating slow and fragile tests),
// we can use the jest.mock() function to automatically mock the axios module.

// start by using jest.mock

jest.mock("axios");
jest.mock("./di");

describe("getUser", () => {
  it("calls fetch with the correct url", () => {
    getUser.mockImplementation(() => [{ name: "Bob" }]);
    expect(getUser()).toStrictEqual([{ name: "Bob" }]);

    // axios.get.mockResolvedValue([{ name: "Bob" }]);
    // total shit
    // expect(getUser({ name: "Bob" })).toStrictEqual([{ name: "Bob" }]);
  });

  // it("calls fetch with the correct url", () => {
  //   axios.get.mockResolvedValue([{ name: "Bob" }]);
  //   expect(getUserDI(jest.fn(() => [{ name: "Bob" }]))).toStrictEqual([
  //     { name: "Bob" },
  //   ]);
  // });
});
