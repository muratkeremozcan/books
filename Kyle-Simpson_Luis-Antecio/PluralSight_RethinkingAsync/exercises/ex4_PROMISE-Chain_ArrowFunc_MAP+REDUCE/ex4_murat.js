function fakeAjax(fileName, cb) {
  var fake_responses = {
    file1: 'The first text',
    file2: 'The middle text',
    file3: 'The last text'
  };
  var randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000;

  console.log('Requesting: ' + fileName);

  setTimeout(function() {
    cb(fake_responses[fileName]);
  }, randomDelay);
}

function output(text) {
  console.log(text);
}

// **************************************
// The old-n-busted callback way

function getFile(file) {
  // getFile now gets a single value and transforms it to a Promise that returns a single value
  return new Promise(function(resolve) {
    fakeAjax(file, resolve);
  });
}

// Request all files at once in
// "parallel" via `getFile(..)`.
//
// Render as each one finishes,
// but only once previous rendering
// is done.

['file1', 'file2', 'file3'] // populate the files we want
  .map(getFile) // transform the files we want into a list of promises . We also make the request for files here
  .reduce(function combine(chain, filePromise) {
    // compose the list of promises together. Reduce takes 2 args (predicateFunction, initialValue) . initialValue here can be an already resolved promise
    return chain
      .then(() => {
        return filePromise;
      })
      .then(text => console.log(text));
  }, Promise.resolve()) // initialValue for reduce, an already resolved promise
  .then(() => console.log('Complete'));

	/*

	Promise.resolve().then(function() {
		return p1;
	}).then(output)
		.then( function() {
		return p2;
	}).then(output)
		.then( function() {
		return p3;
	}).then(output)

	*/