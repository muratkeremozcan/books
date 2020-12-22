#!/usr/bin/env node
// this allows you to run the file in node environment regardless of the OS 

'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

const getStdin = require('get-stdin');

const args = require('minimist')(process.argv.slice(2), 
  { // the object in here is optional to override the default guessing
    boolean: ['help', 'in'],
    string: ['file']
  }
);

const BASE_PATH = path.resolve(       // path.resolve is used to get a file's relative path
  process.env.BASE_PATH || __dirname  // __dirname is used to get the pwd of a file 
)

if (process.env.HELLO) {
  console.log(process.env.HELLO);
}
if (args.help) {
  printHelp();
}
else if (args.in || args._.includes('-')) { // a convention with parameters is - at the end of the line means stdin will provide the rest of the inputs
  getStdin()
    .then(processFile)
    .catch(error);
}
else if (args.file) {
  fs.readFile(path.join(BASE_PATH, args.file), function onContents(err, contents) { 
    if (err) {
      error(err.toString()); // the error we get is an object, convert it to a string to get something meaningful 
    }
    else {
      processFile(contents);
    }
  });
}
else {
  error('incorrect usage', true);
}

// **********

function printHelp() {
  console.log(`
    ex1 usage:
    ex1.js --file={FILENAME}'
    --help             print this help
    --file={FILENAME}  process this file
    --in, -            process stdin`);
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    printHelp();
  }
}

/** Usage:
 * 
 *  `./ex1.js --file=files/hello.txt`
 * 
 * `cat files/hello.txt | ./ex1.js --in`
 * 
 * `BASE_PATH=files ./ex1.js --file=hello.txt`
 */
function processFile(contents) {
    contents = contents.toString().toUpperCase();
    process.stdout.write(contents);
}