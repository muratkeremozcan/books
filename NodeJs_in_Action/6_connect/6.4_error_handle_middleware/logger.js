function setup(format) { // setup function can be called multiple times with different configurations
  const regexp = /:(\w+)/g; // :word or number 1 or more . Regex is used to match request properties

  return function createLogger(req, res, next) { // logger component that Connect will use
    const str = format.replace(regexp, (match, property) => { // uses regex to format log entry for request
      return req[property];
    });
    console.log(str); // prints request log entry to console
    next(); // passes control to the next middleware component
  }
}
module.exports = setup; // directly exports logger setup function
