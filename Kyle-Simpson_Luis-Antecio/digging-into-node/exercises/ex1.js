#!/usr/bin/env node
// this allows you to run the file in node environment regardless of the OS 

'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

const getStdin = require('get-stdin'); // we want our program to be able to receive stdin, not just file names

// process argv is used to receive command line arguments, argz is for number of arguments
// minimist is used to place the arguments into an object with optional configuration
const args = require('minimist')(process.argv.slice(2), 
  { // the object in here is optional to override the default guessing
    boolean: ['help', 'in'],
    string: ['file']
  }
);
// console.log(args);

// example, in console:  ./ex1.js --hello=world -c9
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

const BASE_PATH = path.resolve(       // path.resolve is used to get a file's relative path
  process.env.BASE_PATH || __dirname  // __dirname is used to get the pwd of a file 
)

// we want the program to process 3 different kinds of inputs and als include help & error handling:
// * an environment variable:    BASE_PATH=files ./ex1.js --file=hello.txt
// * a text file:                                ./ex1.js --file=files/hello.txt
// * standard input:                             cat files/hello.txt | ./ex1.js --in


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
  // synchronous file reading is easy...
  // const contents = fs.readFile(filePath, 'utf8');
  // asynchronous file reading requires a callback, here we don't use console.log of encoding parameter for the sake of the example, but we could
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