const ejs = require('ejs');
const template = '<%= message %>'; 
const context = { message: 'Hello template hehe' }; // the data sent to the template for rendering is called CONTEXT  . {templateVale: data}
console.log(ejs.render (template, context));


