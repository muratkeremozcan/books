#!/usr/bin/env node
'use strict';
// process argv is used to receive command line arguments, argz is for number of arguments
// minimist is used to place the arguments into an object with optional configuration
const args = require('minimist')(process.argv.slice(2), 
  { // the object in here is optional to override the default guessing
    boolean: ['help'],
    string: ['file']
  }
);

console.log(args);

// in console, run ./ex1.js --hello=world -c9

// without minimist
// [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'D:\\TRAINING\\Books\\Kyle-Simpson_Luis-Antecio\\digging-into-node\\exercises\\ex1.js',
//   '--hello=world',
//   '-c9'
// ]

// with minimist you get an object back
// { _: [], hello: 'world', c: 9 }

// try  ./ex1.js --help=foobar --file -c9
// { _: [], help: true, file: '', c: 9 }



// printHelp();

// **********

function printHelp() {
  console.log(`
    ex1 usage:
    ex1.js --help
    --help          print this help`);
}