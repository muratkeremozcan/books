let a = 2;

switch (a) {
  case 2:
    console.log('do something');
    break;
  case 42:
    console.log('do another thing');
    break;
  default:
    console.log('fall back here');
}

// you can trick it for coercion
// This works because the case clause can have any expression (not just simple values), 
  // which means it will strictly match that expression’s result to the test expression (true). 
  // Since a == 42 results in true here, the match is made.

a = '42';

switch (true) {
  case a == 10:
    console.log('10 or \'10\'');
    break;
  case a == 42:
    console.log('42 or \'42\'');
    break;
  default:
    console.log('fall here');
}
// !! do not do this with logical operators, use === with that
// Lastly, the default clause is optional, and it doesn’t necessarily have to come at the end (although that’s the strong convention).

a = 10
// switch true with return
switch (true) {
  case a === 10:
    return 'ten'; //?
  case a === 42:
    return 'forty-two'; //?
  default:
    throw new Error('cannot find it');
}