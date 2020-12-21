#!/usr/bin/env node

"use strict";

var util = require("util");
// var childProc = require("child_process");


// ************************************

const HTTP_PORT = 8039;
// const MAX_CHILDREN = 5;

var delay = util.promisify(setTimeout);


main().catch(console.error);


// ************************************

async function main() {
	// console.log(`Load testing http://localhost:${HTTP_PORT}...`);
}
