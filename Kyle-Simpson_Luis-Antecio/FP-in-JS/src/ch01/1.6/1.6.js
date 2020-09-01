console.log('I am running');

var valid = false;
var elem = document.querySelector('#student-ssn');

elem.onkeyup = function (event) {
	var val = elem.value; // 'student-ssn'
	if(val !== null && val.length !== 0) {
		val = val.replace(/^\s*|\s*$|\-/g, ''); // replace spaces and - with nothing: mutates data
		if(val.length === 9) { // nested branching is not great
			console.log(`Valid SSN: ${val}!`);  // side effect reaching to data outside the scope
			valid = true;
		}		
	}
	else {
		console.log(`Invalid SSN: ${val}!`);
	}
};