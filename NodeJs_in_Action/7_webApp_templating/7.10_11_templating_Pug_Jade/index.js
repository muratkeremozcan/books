const pug = require('pug');
const fs = require('fs');
const templateFile = './templates/page.pug';
const iterTemplate = fs.readFileSync(templateFile); // template to use
const context = { messages: [ // context = { templateValue: jsValue }
  'You have logged in successfully.',
  'Welcome back!'
]};
// pug.compile(template)(context)
// this is where the template is using a parent :  pug.compile(childTemplate, {filename: parentTemplate}) (context)
const iterFn = pug.compile(iterTemplate, {filename: templateFile} )(context);
console.log(iterFn);