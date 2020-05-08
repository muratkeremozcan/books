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


// a lot more on Kyle's book...