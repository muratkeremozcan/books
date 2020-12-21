#!/usr/bin/env node

"use strict";

var path = require("path");
var fs = require("fs");
var zlib = require("zlib");
var Transform = require("stream").Transform;

var args = require("minimist")(process.argv.slice(2),{
	boolean: ["help","in","out","uncompress","compress",],
	string: ["file",],
});

const BASEPATH =
	path.resolve(process.env.BASEPATH || __dirname);

var OUTPATH = path.join(BASEPATH,"out.txt");


if (args.help || process.argv.length <= 2) {
	error(null,/*showHelp=*/true);
}
else if (args._.includes("-") || args.in) {
	processFile(process.stdin);
}
else if (args.file) {
	let filePath = path.join(BASEPATH,args.file);
	processFile(
		fs.createReadStream(filePath)
	);
}
else {
	error("Usage incorrect.",/*showHelp=*/true);
}




// ************************************

function printHelp() {
	console.log("ex2 usage:");
	console.log("");
	console.log("--help                      print this help");
	console.log("-, --in                     read file from stdin");
	console.log("--file={FILENAME}           read file from {FILENAME}");
	console.log("--uncompress                uncompress input file with gzip");
	console.log("--compress                  compress output with gzip");
	console.log("--out                       print output");
	console.log("");
	console.log("");
}

function error(err,showHelp = false) {
	process.exitCode = 1;
	console.error(err);
	if (showHelp) {
		console.log("");
		printHelp();
	}
}

function processFile(inputStream) {
	var stream = inputStream;
	var outStream;

	if (args.uncompress) {
		let gunzip = zlib.createGunzip();
		stream = stream.pipe(gunzip);
	}

	var upperCaseTr = new Transform({
		transform(chunk,encoding,callback) {
			this.push(chunk.toString().toUpperCase());
			callback();
		}
	});

	stream = stream.pipe(upperCaseTr);

	if (args.compress) {
		OUTPATH = `${OUTPATH}.gz`;
		let gzip = zlib.createGzip();
		stream = stream.pipe(gzip);
	}

	if (args.out) {
		outStream = process.stdout;
	}
	else {
		outStream = fs.createWriteStream(OUTPATH);
	}

	stream.pipe(outStream);
}
