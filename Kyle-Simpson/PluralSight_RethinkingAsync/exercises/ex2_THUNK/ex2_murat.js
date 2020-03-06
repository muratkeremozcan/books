function fakeAjax(fileName, cb) { // will request 1 file, and the file will be provided with the callback
  var fake_responses = {
    file1: 'contents of file1', // you can only request one of these 3 fileContent
    file2: 'contents of file2',
    file3: 'contents of file3'
  };
  var randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000;

  console.log('Requesting ' + fileName);

  setTimeout(function () { // the response will have a random delay
    cb(fake_responses[fileName]); // will respond with the file requested/available

  }, randomDelay); // with a random delay
}

function output(text) {
  console.log('\nserving file :', text, '\n');
}

function getFile(file) { // this is our thunk constructor, makes thunks
  var text, fileName;

  fakeAjax(file, function (response) {
    console.log('-> line 25: fakeAjax ');
    if (fileName) { // if fileName has been set, the return function has been called
      fileName(response);
      console.log('line 28: fileName has been set, the return function has been called ');
    } else { // if fileName has not been set, save the response
      text = response;
      console.log('line 31, fileName has not been set, save the response :', text); // how does it throw it to line 25?
    }
  });
  return function (cb) {
    console.log('\nline 35: we want file:', file, '. Is', file, 'defined yet? :', text);

    if (text) { // if the text has been set, send it to the callback
      console.log('line 38: text is DEFINED, send it to the callback');
      cb(text);
    } else { // if the text has not been set, save the callback
      console.log('line 41: text is UNDEFINED, save the callback');
      fileName = cb; // how does it throw it to line 25?
    }
  };
}

// requesting files

// a thunk requests a value, we get the value when it's ready
var th1 = getFile("file1"); // thunk is what we get from getFile
var th2 = getFile("file2");
var th3 = getFile("file3");

// sequences the output to 1, 2, 3
th1(function (fileName) {
  output(fileName);
  th2(function (fileName) {
    output(fileName);
    th3(function (fileName) {
      output(fileName);
      output("\nComplete");
    });
  });
});