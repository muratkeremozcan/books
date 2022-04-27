// import fetch from "node-fetch";

const axios = require("axios");

async function getUser(params = {}) {
  const res = await axios({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users",
    params,
  });

  return res.data;
}

// getUser({ id: 1 }); /*?+*/

// if dependency injection is used, the dependency just gets passed in as an argument

async function getUserDI(axios, params = {}) {
  const res = await axios({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users",
    params,
  });

  return res.data;
}

// getUserDI(axios, {
//   id: 2,
// }); /*?+*/

module.exports = {
  getUser,
  getUserDI,
};

// benefits:
// 1 - the dependencies of the fn are clearer and it is easier to move it around
// 2 - the fn is easier to test
