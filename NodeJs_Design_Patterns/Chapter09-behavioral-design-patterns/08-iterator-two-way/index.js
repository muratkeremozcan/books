function * twoWayGenerator () {
  try {
    const what = yield null
    yield 'Hello ' + what
  } catch (err) {
    yield 'Hello error: ' + err.message
  }
}

console.log('Passing a value back to the generator:')
const twoWay = twoWayGenerator() 

// The first time the next() method is invoked, the generator reaches the first yield statement and is then put on pause.
twoWay.next() //?
// When next('world') is invoked, the generator resumes from the point where it was put on pause, which is on the yield instruction, 
// but this time we have a value that is passed back to the generator. 
// This value will then be set to the what variable. The generator then appends the what variable to the string 'Hello ' and yields the result.
twoWay.next('world') //?

console.log('Using throw():')
const twoWayException = twoWayGenerator()
twoWayException.next() //?
// the throw method behaves like next() but it will also throw an exception within the generator as if it was thrown at the point of the last yield,
twoWayException.throw(new Error('Boom!')) //?

console.log('Using return():')
const twoWayReturn = twoWayGenerator() 
// the return() method, forces the generator to terminate and returns an object
twoWayReturn.return('myReturnValue') //?
