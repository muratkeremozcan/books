const ejs = require('ejs');
const fs = require('fs');
const http = require('http');
const filename = './templates/students.ejs'; // template file

const students = [ // data to pass in to the template file: CONTEXT
  { name: 'Rick LaRue', age: 23 },
  { name: 'Sarah Cathands', age: 25 },
  { name: 'Bob Dobbs', age: 37 }
];

const server = http.createServer( (req, res) => { // create HTTP server
  if(req.url === '/') {
    fs.readFile(filename, (err, data) => { // read template from template file
      const template = data.toString();
      const context = { students: students }; // { templateValue: jsValue }
      const output = ejs.render(template, context); // render template
      // optional caching
      // const cache = process.env.NODE_ENV === 'production';
      // const output = ejs.render(
      // template,
      // { students, cache, filename }
      // );
      res.setHeader('Content-type', 'text/html'); // format http response
      res.end(output); // send http response
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(3000, function() {
  console.log('listening..');
});
