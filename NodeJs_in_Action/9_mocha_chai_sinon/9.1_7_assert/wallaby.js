"use strict";

module.exports = function () {
  return {
    files: [
      './todo.js',
    ],

    tests: [
      './test.js',
    ],

    env: {
      type: 'node'
    }
  };
};