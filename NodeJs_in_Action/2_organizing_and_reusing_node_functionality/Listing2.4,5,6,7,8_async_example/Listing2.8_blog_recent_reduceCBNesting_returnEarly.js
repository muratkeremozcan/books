// This example handles callback nesting by using named functions
// IMPORTANT: most node modules use CALLBACKs with 2 arguments. 1st argument is for error/er/err. 2nd argument if for results

const fs = require('fs');
const http = require('http');

http.createServer((req, res) => { // create an HTTP server and use a CALLBACK to define response logic
    getTitles(res);
  }).listen(8001, '127.0.0.1');

function getTitles(res) {
  fs.readFile('./titles.json', (err, data) => { // read JSON file and use CALLBACK to define what to do next
    // if (err) {
    //   hadError(err, es);
    // } else {
    //   getTemplate(JSON.parse(data.toString()), res);
    // }

    // EARLY RETURNING alternative
    if (err) return hadError(err, res);
    getTemplate(JSON.parse(data.toString()), res); // parse data from JSON to text
  });
}

function getTemplate(titles, res) {
  fs.readFile('./template.html', (err, data) => { // read html and use callback once the html is loaded
    // if(err) {
    //   hadError(err, res);
    // } else {
    //   formatHtml(titles, data.toString(), res);
    // }

    // EARLY RETURNING alternative
    if (err) return hadError(err, res);
    formatHtml(titles, data.toString(), res);
  });
}

function formatHtml(titles, tmpl, res) { // assemble HTML page showing blog titles
  const html = tmpl.replace('%', titles.join('</li><li>')); // join() method joins all elements of an array. arr.join(<optional separator>)
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html); // send HTML page to user
}

function hadError(err, res) {
  console.error(err);
  res.end('Server Error');
}
