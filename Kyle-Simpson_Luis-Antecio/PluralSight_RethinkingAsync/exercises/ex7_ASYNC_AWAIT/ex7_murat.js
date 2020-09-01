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
  return new Promise(resolve => {
    fakeAjax(file, resolve);
  });
}

// Request all files at once in
// "parallel" via `getFile(..)`.
//
// Render as each one finishes,
// but only once previous rendering
// is done.

async function asyncFunction() {
  try {
    const p1 = await getFile("file1");
    const p2 = await getFile("file2");
    const p3 = await getFile("file3");
    console.log(p1);
    console.log(p2);
    console.log(p3);
  } catch (err) {
    console.log(err);
  }
  console.log('Complete');
}

asyncFunction();