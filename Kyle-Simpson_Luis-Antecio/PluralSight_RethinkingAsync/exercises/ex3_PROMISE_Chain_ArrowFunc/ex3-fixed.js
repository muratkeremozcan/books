function fakeAjax(fileName, cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	console.log("Requesting: " + fileName);

	setTimeout(function () {
		cb(fake_responses[fileName]);
	}, randomDelay);
}

function output(text) {
	console.log(text);
}

// **************************************

function getFile(file) {
	return new Promise( resolve => {
		fakeAjax(file, resolve);
	});
}

// Request all files at once in
// "parallel" via `getFile(..)`.
var p1 = getFile("file1");
var p2 = getFile("file2");
var p3 = getFile("file3");

// Render as each one finishes,
// but only once previous rendering
// is done.
p1
	.then(output)
	.then(function () {
		return p2;
	})
	.then(output)
	.then(function () {
		return p3;
	})
	.then(output)
	.then(function () {
		output("Complete!");
	});
