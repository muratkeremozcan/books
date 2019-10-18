function fakeAjax(fileName, cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	console.log("Requesting: " + fileName);

	setTimeout(function () {
		console.log('\nran setTimeout, readying a response');
		cb(fake_responses[fileName]);
	}, randomDelay);
}

function output(text) {
	console.log(text);
}

// **************************************

function getFile(file) {
	var resp;
	fakeAjax(file, function (text) { // this is the request, runs as soon as we call getFile. If fakeAjax ran setTimeout, this happens first
		console.log('line 26: a response for the file:', file, ', is ready to be sent:', text);
		if (!resp) {
			resp = text;
			console.log('line 29, no request for:', file, ', yet. Save the response to be sent when it is requested:', resp);
		} else { // if there is a response ready, run the saved callback
			console.log('line 31, there is a response handler ready for the requested file and text:', file,text,', now responding:');
			resp(text); //
		}
	});
	return function thunk(cb) { // this is the response handler. If fakeAjax did not run setTimeout yet, it first falls here
		console.log('\nline 36: ran the response handler. We want file:', file, '. Is', file, 'defined yet? :', resp);
		console.log('the callback is\n', cb);
		if (resp) { // if the response is ready, handle it
			console.log('line 39: response is DEFINED,',resp,' . now responding:');
			cb(resp); // run setTimeout with the callback, pass in the text that is ready
		} else { // if the response is not ready, store it for later when it's requested
			resp = cb;
			console.log('line 43: response is not ready to handle yet, saved the response handler for now');
		}
	};
}

// request all files at once in "parallel"
var th1 = getFile("file1");
var th2 = getFile("file2");
var th3 = getFile("file3");


// a thunk requests a value, we get the value when it's ready
// async thunk has a callback as its argument, wraps a state/value, that state gives a value, the value uses the callback.
// // Eliminates time as a factor - we get it when it's ready
th1(function ready(text){
	output(text);
	th2(function ready(text){
		output(text);
		th3(function ready(text){
			output(text);
			output("Complete!");
		});
	});
});