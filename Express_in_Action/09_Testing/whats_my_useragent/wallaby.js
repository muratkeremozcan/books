"use strict";

module.exports = function () {
  return {
    files: [
      './*.js',
    ],

    tests: [
      './test/*.js',
    ],

    env: {
      type: 'node'
    }
  };
};