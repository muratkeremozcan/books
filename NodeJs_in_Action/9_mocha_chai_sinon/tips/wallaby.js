"use strict";

module.exports = function () {
  return {
    files: [
      './index.js',
    ],

    tests: [
      './test/*.js',
    ],

    env: {
      type: 'node'
    }
  };
};