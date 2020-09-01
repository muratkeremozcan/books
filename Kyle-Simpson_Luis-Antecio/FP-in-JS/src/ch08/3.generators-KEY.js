function* addGenerator() {
  var i = 0;
  while (true) {
    i += yield i;
  }
}
let adder = addGenerator();

adder.next(); //?
adder.next(5); //?
adder.next(5).value; //?


function* range(start, finish) {
  for (let i = start; i < finish; i++) {
    yield i;
  }
}
let r = range(0, Number.POSITIVE_INFINITY);

r.next(); //?
r.next(); //?
r.next(); //?
r.next().value; //?


/** takes first n items from a generator */
function take(amount, generator) {
  let result = [];
  for (let n of generator) {
    result.push(n);
    if (n === amount) {
      break;
    }
  }
  return result;
}


take(3, range(1, Infinity)); //?



function* AllStudentsGenerator(){
  yield 'Church';
  yield 'Rosser';
  yield* RosserStudentGenerator();
  yield 'Turing';
  yield* TuringStudentGenerator();
  yield 'Kleene';
  yield* KleeneStudentGenerator();
}
function* RosserStudentGenerator(){
  yield 'Mendelson';
  yield 'Sacks';
}
function* TuringStudentGenerator(){
  yield 'Gandy';
  yield 'Sacks';
}
function* KleeneStudentGenerator(){
  yield 'Nelson';
  yield 'Constable';
}
// the looping mechanism iterates just as if it were one big generator
for(let student of AllStudentsGenerator()){
 console.log(student);
}


// creating a generator from scratch
function range_scratch(start, end) {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if(start < end) {
        return { value: start++, done:false };
      }
      return { done: true, value:end };
    }
  };
}

const range5_10 = range_scratch(5, 10); //?
range5_10.next(); //?
range5_10.next(); //?
take(2, range5_10); //?


// convert an array or string into a generator
var iter = ['S', 't', 'r', 'e', 'a', 'm'][Symbol.iterator]();
iter.next().value; //?
iter.next().value; //?

var iter = 'Stream'[Symbol.iterator]();
iter.next().value; //?
iter.next().value; //?