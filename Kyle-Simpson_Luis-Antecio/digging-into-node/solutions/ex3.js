#!/usr/bin/env node

"use strict";

var util = require("util");
var path = require("path");
var fs = require("fs");
var zlib = require("zlib");
var Transform = require("stream").Transform;

var CAF = require("caf");


// async initializations
var fsStatAsync = util.promisify(fs.stat);
var fsMkdirAsync = util.promisify(fs.mkdir);
processFile = CAF(processFile);
// ************


var args = require("minimist")(process.argv.slice(2),{
	boolean: ["help","in","out","uncompress","compress",],
	string: ["file",],
});

const BASEPATH =
	path.resolve(process.env.BASEPATH || __dirname);

const BASEOUTPATH = path.resolve(
	process.env.BASEOUTPATH || path.join(__dirname,"outfiles")
);

var OUTPATH = path.join(BASEOUTPATH,"out.txt");

main().catch(error);




// ************************************

async function main() {
	try {
		await fsStatAsync(BASEOUTPATH);
	}
	catch (err) {
		await fsMkdirAsync(BASEOUTPATH);
	}

	var timeout = CAF.timeout(1000,"Took too long.");

	if (args.help || process.argv.length <= 2) {
		error(null,/*showHelp=*/true);
	}
	else if (args._.includes("-") || args.in) {
		await processFile(timeout,process.stdin);

		// temporary debug output
		console.error("Complete.");
	}
	else if (args.file) {
		let filePath = path.join(BASEPATH,args.file);

		await processFile(timeout,fs.createReadStream(filePath));

		// temporary debug output
		console.error("Complete.");
	}
	else {
		error("Usage incorrect.",/*showHelp=*/true);
	}
}

function streamComplete(stream){
	return new Promise(function c(res){
		stream.on("end",res);
	});
}

function printHelp() {
	console.log("ex3 usage:");
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

function *processFile(signal,inputStream) {
	var stream = inputStream;
	var outStream;

	if (args.uncompress) {
		let gunzip = zlib.createGunzip();
		stream = stream.pipe(gunzip);
	}

	var uppercase = new Transform({
		transform(chunk,encoding,done) {
			this.push(chunk.toString().toUpperCase());
			done();
		}
	});

	stream = stream.pipe(uppercase);

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

	// listen for cancelation to abort output
	signal.pr.catch(function onCancelation(){
		stream.unpipe(outStream);
		stream.destroy();
	});

	yield streamComplete(stream);
}
