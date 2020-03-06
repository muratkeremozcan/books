"use strict";

module.exports = function () {
  return {
    files: [
      './phoneNumbers-text-synchronous.js',
    ],

    tests: [
      './test/test.js',
    ],

    env: {
      type: 'node'
    }
  };
};