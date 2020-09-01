const hello = require('./bar').hello;

var hungry = 'hippo';

function awesome() {
  return hello(hungry).toUpperCase();
}

// similar to EXPORT DEFAULT 
module.exports = awesome;