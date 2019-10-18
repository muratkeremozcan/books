"use strict";

module.exports = function () {
  return {
    files: [
      './db.js',
    ],

    tests: [
      './spies.js',
      './stub.js'
    ],

    env: {
      type: 'node'
    }
  };
};