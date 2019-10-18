const ASQ = require('asynquence');
function fakeAjax(url,cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	console.log("Requesting: " + url);

	setTimeout(function(){
		cb(fake_responses[url]);
	},randomDelay);
}

function output(text) {
	console.log(text);
}

// **************************************
// var getFile = ASQ.wrap(fakeAjax) // he was showing off ASQ in Ex 5 solution..
function getFile(file) {
	return ASQ(function(done){
		fakeAjax(file,done);
	});
}
// compare to Promise
// function getFile(file) {
//   return new Promise((resolve, reject) => {
//       fakeAjax(file, resolve); // resolve with the text if promise successful
//   });
// }


// Request all files at once in
// "parallel" via `getFile(..)`.
var s1 = getFile("file1");
var s2 = getFile("file2");
var s3 = getFile("file3");
// Render as each one finishes,
// but only once previous rendering
// is done.

s1.val(output)
	.seq(s2)
	.val(output)
	.seq(s3)
	.val(output)
	.val(function(){
			output("Complete!");
	});

// exercise file solution
// ASQ()
// .seq( getFile("file1") )
// .val( output )
// .seq( getFile("file2") )
// .val( output )
// .seq( getFile("file3") )
// .val( output )
// .val(function(){
// 	output("Complete!");
// });
