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
  console.log('serving file :', text);
}

// **************************************

function getFile(fileName) {
  fakeAjax(fileName, function(fileContent) { // request the file, and receive it . The callback function will also handle the responses
    console.log('\nreceiving ' + fileName);
    handleResponses(fileName, fileContent); // handle the received file
  });
}

var responses = {}; // an object to hold responses as they are received, but not yet ready to print
var fileNames = ["file1", "file2", "file3"]; // we arbitrarily state that these are the files we will be receiving, for the sake of the example

function handleResponses(fileName, fileContent) {
  if (!(fileName in responses)) { // if the file has not been stored yet, store it
    responses[fileName] = fileContent;
    console.log('file not in responses yet, stored file in responses: ', responses, '\n');
  }
  // at this point, the response is stored in responses object

  // no matter the order of files received, we want to output them in order: 1, 2, 3
  for (var i = 0; i < fileNames.length; i++) { // loop over fileNames, check to see if we can render yet
    if (fileNames[i] in responses) { // is the file we expect (1,2,3) in responses yet?
      if (responses[fileNames[i]] !== 'file served') { // has the file been served yet? If it has been served, check the next file
        output(responses[fileNames[i]]); //
        responses[fileNames[i]] = 'file served'; // once we have already received and outputted the content, set the response content to true so we don't output it anymore
      }
    } else { // if the file we expect is not in responses yet, break out of the function, we are not outputting this file, we just stored it
      return false;
    }
  }

  output("Complete");
}

// request all fileContent synchronously
getFile('file1');
getFile('file2');
getFile('file3');