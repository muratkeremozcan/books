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
  return new Promise((resolve, reject) => {
      fakeAjax(file, resolve); // resolve with the text if promise successful
  });
} // reject is not being used because fakeAjax has no error handling

// Request all files at once in
// "parallel" via `getFile(..)`.
var p1 = getFile("file1");
var p2 = getFile("file2");
var p3 = getFile("file3");

// Render as each one finishes,
// but only once previous rendering
// is done.
p1.then(text => console.log(text))
  .then( () => p2) // pass in a function that returns the next promise
  .then(text => console.log(text)) // once p2 is ready, output again
  .then( () => p3)
  .then(text => console.log(text))
  .then( () => console.log('Complete'))
  .catch(err => console.log(err));

// you can also use the output utility, which receives the text and prints it out.
// p1.then(output) // here you are not calling the output function, you are passing a reference to the output function
//   .then( () => p2)
//   .then(output)
//   .then( () => p3)
//   .then(output)
//   .then( () => output('Complete'))
//   .catch(err => console.log(err));