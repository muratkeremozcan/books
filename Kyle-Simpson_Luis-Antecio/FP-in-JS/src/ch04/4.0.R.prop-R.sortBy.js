import R from 'ramda';

var arrayUsers = [
  [ 'z', 'a' ],
  [ 'y', 'b' ],
  [ 'x', 'c' ],
  [ 'w', 'd']
];

var objectUsers = [
  { first_name: 'z', last_name: 'a' },
  { first_name: 'y', last_name: 'b' },
  { first_name: 'x', last_name: 'c' },
  { first_name: 'w', last_name: 'd' }
];

// R.prop gets the KEY/PROPERTY/index.
// In an array, each property is an index
R.prop(0, ['z', 'a']); //?
R.prop(1, ['z', 'a']); //?
R.prop(2, [ 'z', 'a', 'df' ]); //?
R.prop(0, [[ 'z', 'a' ],['y']]); //?
R.prop(1, [[ 'z', 'a' ],['y']]); //?

// in an array of objects, each PROPERTY is an array item (an object)
R.prop(0,  [{ first_name: 'z', last_name: 'a' }, { first_name: 'y', last_name: 'b' }]); //?

// accessing objects, each property is obviously a property
R.prop('first_name',  { first_name: 'z', last_name: 'a' }); //?

// this is how you would access the property of an object in an array of objects
R.prop('first_name', R.prop(0,  [{ first_name: 'z', last_name: 'a' }, { first_name: 'y', last_name: 'b' }])); //?

// instead, you can specify property of a property with R.path
R.path([0, 'first_name'], [{ first_name: 'z', last_name: 'a' }, { first_name: 'y', last_name: 'b' }]); //?


R.prop(0, arrayUsers); //?
R.path([0, 0], arrayUsers); //?
R.prop(0, objectUsers); //?
R.path([0, 'first_name'], objectUsers); //?



// sortBy : makes a lot of sense with objects
// given an array of objects, sorts by the array.object.property/key
R.sortBy(R.prop('first_name'), objectUsers); //?
R.sortBy(R.prop('last_name'), objectUsers); //?


// sortBy can get confusing with array of arrays because it wants to sort by array.arrayElem.index
// sorts by 'z'
R.sortBy(R.prop(0), arrayUsers); //?
// ok, sorts by 'a'
R.sortBy(R.prop(1), arrayUsers); //?

// well,  arrayUsers.arrayElem.key 2  does not exist, because each array element has only 2 indexes: 0 and 1
R.sortBy(R.prop(2), arrayUsers); //?



var testUsers = [
  ['Rosser', 80],
  ['Turing', 100],
  ['Kleene', 90],
  ['Church', 99]
];

R.prop(0, testUsers); //?
R.prop(1, testUsers); //?
R.prop(2, testUsers); //?
R.prop(3, testUsers); //?

// sorts by Rosser
R.sortBy(R.prop(0), testUsers); //?
// sorts by 80
R.sortBy(R.prop(1), testUsers); //?

// no sorting beyond this
R.sortBy(R.prop(2), testUsers); //?