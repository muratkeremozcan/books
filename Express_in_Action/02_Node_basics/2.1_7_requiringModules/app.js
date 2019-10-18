// requiring built-in modules
var url = require('url'); // require url module, put it in a variable
var parsedURL = url.parse('http://www.example.com/profile?name=barry'); // uses parse() function of the url module
var mustache = require('mustache');

console.log(parsedURL.protocol);
console.log(parsedURL.host);
console.log(parsedURL.query);

var result = mustache.render("Hello, {{first}} {{last}}!", {
  first: "Nicolas",
  last: "Cage"
});