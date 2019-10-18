"use strict";
var assert = require('assert');

const text ="\u5FCD\u8005\u30D1\u30EF\u30FC";
const matchAll =  /[\w\u0080-\uFFFF_-]+/; // match all normal word characters \w, and unicode range above 0
assert(text.match(matchAll), "Our regexp matches unicode!");
console.log(text.match(matchAll));


const pattern = /^((\w+)|(\\.))+$/; // this regex allows any sequence composed of word characters, a backslash followed by any character, or both
  const tests = [
    "formUpdate",
    "form\\.update\\.whatever",
    "form\\:update",
    "\\f\\o\\r\\m\\u\\p\\d\\a\\t\\e",
    "form:update" // this should fail
  ];

  for (let n = 0; n < tests.length; n++) {
    // The test() method executes a search for a match between a regular expression and a specified string. Returns true or false.
    console.log(pattern.test((tests[n])), tests[n]); //
    assert(pattern.test(tests[n]), tests[n] + " is a valid identifier");
  }