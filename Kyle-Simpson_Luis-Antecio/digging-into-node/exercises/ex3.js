#!/usr/bin/env node
// this allows you to run the file in node environment regardless of the OS 

'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const zlib = require('zlib');
const Transform = require('stream').Transform;

const args = require('minimist')(process.argv.slice(2), 
  { // the object in here is optional to override the default guessing
    boolean: ['help', 'in', 'out', 'compress', 'uncompress'],
    string: ['file']
  }
);

const BASE_PATH = path.resolve(       // path.resolve is used to get a file's relative path
  process.env.BASE_PATH || __dirname  // __dirname is used to get the pwd of a file 
);

let OUT_FILE = path.join(BASE_PATH, "out.txt");

if (process.env.HELLO) {
  console.log(process.env.HELLO);
}
if (args.help) {
  printHelp();
}
else if (args.in || args._.includes('-')) { // a convention with parameters is - at the end of the line means stdin will provide the rest of the inputs
  processFile(process.stdin);
}
else if (args.file) {
  // streams: readableStream.pipe(writeableStream). -> gives you a readable stream
  // here processFile takes a readable stream instead of just a file 
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  processFile(stream);
}
else {
  error('incorrect usage', true);
}

// **********

/** Usage:
 * 
 *  `./ex1.js --file=files/hello.txt`
 * 
 * `cat files/hello.txt | ./ex1.js --in`
 * 
 * `BASE_PATH=files ./ex1.js --file=lorem.txt --compress`
 * 
 * `BASE_PATH=files ./ex2.js --file=out.txt.gz --uncompress --out
 */
function processFile(inputStream) {
  let stream = inputStream;
  let outStream;

  if (args.uncompress) {
    let gunzipStream = zlib.createGunzip();
    stream = stream.pipe(gunzipStream);
  }

  let upperCaseTr = new Transform({
    transform(chunk, encoding, cb) {
      this.push(chunk.toString().toUpperCase());
      cb();
    }
  });

  stream = stream.pipe(upperCaseTr);

  if (args.compress) {
    OUT_FILE = `${OUT_FILE}.gz`
    let gzipStream = zlib.createGzip();
    stream = stream.pipe(gzipStream);
  }

  if (args.out) {
    outStream = process.stdout;
  } else {
    outStream = fs.createWriteStream(OUT_FILE);
  }

  // readableStream.pipe(writeableStream)
  stream.pipe(outStream);
}

function printHelp() {
  console.log(`
    ex2 usage:
    ex2.js --file={FILENAME}'
    --help             print this help
    --file={FILENAME}  process this file
    --in, -            process stdin
    --out              print stdout
    --compress         gzip the output
    --uncompress       un-zip the output
    `);
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    printHelp();
  }
}
