// The intention of functional programs is to gain the required structure that leads to composition,
// the backbone of functional programming.
// In essence, functional composition is a process used to group together complex behavior 
// that has been broken into simpler tasks.
// the beauty is in separating the function's description from evaluation; until the final compose nothing is executed


import R from 'ramda';
import _ from 'lodash';

const str = `We can only see a   short distance ahead but we can see plenty there that needs to be done`;
const explode = (str) => str.split(/\s+/); // s+ to address possible more than 1 space between strings
const count = (arr) => arr.length;

explode(str); //?

count(explode(str)); //?
R.compose(count, explode)(str); //?
R.pipe(explode, count)(str); //?


//////

const trim = (str) => str.replace(/^\s*|\s*$/g, ''); // trim space before and after
const normalize = (str) => str.replace(/\-/g, ''); // remove dashes

const ssn = '  444-444444  ';
trim(ssn); //?
normalize(ssn); //?

R.compose(normalize, trim)(ssn); //?

// note that these 2 compose well together, we can use it to get clean input, and worry about the arg being passed later
const cleanInput = R.compose(normalize, trim);
cleanInput(ssn); //?


// we are going to keep strLength as the first argument, in order to specify the fixed argument with partial later
const validLength = (strLength, ssn) => ssn.length === strLength;
// with spaces, ssn has 14 spaces. How do we address this?
validLength(14, ssn); //?

// strLength is being specified first, because this is what we want checkSsnLength to do
// partial is useful when there are guaranteed arguments like this
const checkSsnLength = _.partial(validLength, 9);
// fase, because current ssn not formatted
checkSsnLength(ssn); //?

// compose makes it so that 
// cleanInput is already waiting for the arg to be passed in later, so no need for curry)
// checkSsnLength is already setup with partial to have 9 specified string length
// we use compose to move the argument from function to function
R.compose(
  checkSsnLength,
  cleanInput // you could alternatively use 2 steps here: normalize, trim
)(ssn); //?

// great example of splitting problems into sub problems. This would be hard if we did not abstract away the specialization