"use strict";

module.exports = function () {
  return {
    files: [
      './phoneNumbers-text-synchronous.js',
      './phoneNumber-text-AsyncAwait.js'
    ],

    tests: [
      './test/test.js',
    ],

    env: {
      type: 'node'
    }
  };
};