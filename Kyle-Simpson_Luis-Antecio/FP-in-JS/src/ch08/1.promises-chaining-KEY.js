const Student = require('../../model/Student.js').Student;
const Address = require('../../model/Address.js').Address;
const Person = require('../../model/Person.js').Person;
const IO = require('../../model/monad/IO.js').IO;
const R = require('ramda');
const fork = (join, func1, func2) => (val) => join(func1(val), func2(val));
const csv = arr => arr.join(',');

const getJSON = function (fakeUrl) {
  return new Promise((resolve, reject) => {
    if (fakeUrl.indexOf('students') >= 0) {
      var s1 = new Student('111-11-1111', 'Haskell', 'Curry', 'Princeton', 1900, new Address('US'));
      var s2 = new Student('222-22-2222', 'Barkley', 'Rosser', 'Princeton', 1907, new Address('Greece'));
      var s3 = new Student('333-33-3333', 'John', 'von Neumann', 'Princeton', 1903, new Address('Hungary'));
      var s4 = new Student('444-44-4444', 'Alonzo', 'Church', 'Princeton', 1903, new Address('US'));
      resolve([s1, s2, s3, s4]);
    }
    else {
      resolve([80, 70, 20, 40, 99, 100]);
    }
  });
};


// Because promises remove the details of handling asynchronous calls, 
// you can create programs that feel as if every function executes one after the other, 
// without any wait time or knowledge that you’re requesting data from an external server; 
// promises hide the asynchronous flow but emphasize the notion of time with then.

const hide = R.tap(() => console.log('Hiding spinner'))
const average = R.compose(Math.ceil, fork(R.divide, R.sum, R.length));

getJSON('/students')
  .then(hide)
  .then(R.filter(s => s.address.country === 'US')) // select the students in US
  .then(R.sortBy(R.prop('_ssn'))) // sort the remaining students by ssn
  .then(R.map(student => { // takes this list and maps another getJSON request
    return getJSON('/grades?ssn=' + student.ssn) // to get grades for the filtered students...
      .then(average) // computes the average using functional combinators, Ramda, and Math.ceil (compose and mix and match functions, a chain cannot!)
      .then(grade =>
        IO.of
          (R.merge({ '_grade': grade }, student)) // uses IO monad to output the student and grade information
          // .map(console.log)				
          .map(R.props(['_ssn', '_firstname', '_lastname', '_grade']))
          .map(csv)
          .map(console.log).run())  // <- Print results to the console								
  }))
  .catch(function (error) {
    console.log('Error occurred: ' + error.message);
  });

// The inefficiency above is that 2nd phase of getJson; once the students are filtered. getJSON.then().then() is invoked for each student sequentially 
// promise.all can be more efficient in certain situations
// Suppose that for the same set of students, you want to compute their total average grade. 
// In this case, it doesn’t matter in which order you fetch the data or which requests arrive first, so you can do it concurrently.

getJSON('/students')
  .then(hide)
  .then(R.map(student => '/grades?ssn=' + student.ssn)) // extract a list of grade urls
  .then(gradeUrls => Promise.all(R.map(getJSON, gradeUrls))) // get all the urls concurrently
  .then(R.map(average)) // compute the average grade for each student
  .then(average) // compute the average grade for the entire class
  .then(grade => IO.of(grade).map(console.log).run()) // use IO monad to write the values to the console
  .catch(error => console.log(error.message))

