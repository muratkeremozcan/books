// CSS classes in pug
// div.content.sidebar  :  <div class="content sidebar"></div>

// CSS id in pug
// div.content.sidebar#featured_content  : <div class="content sidebar" id="featured_content"></div>
// can drop div. for shorthand: content.sidebar#featured_content

// Tag attributes in pug
// a(href='http://nodejs.org', target='_blank')

// strong tag in pug
// strong Select your favorite food

// form with option
// form
// option(value='Cheese') Cheese
// option(value='Tofu', selected) Tofu

// lengthy lines in pug
// textarea
// | This is some default text
// | that the user should be
// | provided with.

// ul and li
// ul
//   li: a(href='http://nodejs.org/') Node.js homepage
//   li: a(href='http://npmjs.org/') NPM homepage
//   li: a(href='http://nodebits.org/') Nodebits blog


// link in pug
const pug = require('pug');
const template = 'a(href = url)';
const context = { url: 'http://google.com' }; // { templateValue: jsValue }
console.log(pug.compile(template)(context)); // pug.compile(template)(context)

// id example
const templateIdExample = 'strong #{message}';
const contextIdExample = { message: 'Hello template!' };
console.log(pug.compile(templateIdExample)(contextIdExample));

// iteration in pug
const fs = require('fs');
const templateIterationExample = fs.readFileSync('./template.pug');
const contextIterationExample = {
  messages: [
    'You have logged in successfully.',
    'Welcome back!'
  ]
};
console.log(pug.compile(templateIterationExample)(contextIterationExample));
// prefixing with - will execute JS without including any value returned from the code in the output
// prefixing with = will execute JS and return value, escapes to prevent XSS attacks. Use != if your S generates code that shouldn't be escaped