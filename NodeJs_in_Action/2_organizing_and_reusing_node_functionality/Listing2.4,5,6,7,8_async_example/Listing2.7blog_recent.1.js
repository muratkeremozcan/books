const http = require('http');
const fs = require('fs');

http.createServer((req, res) => { // create an HTTP server and use a CALLBACK to define response logic
  if (req.url == '/'){
    fs.readFile('./titles.json', (err, data) => { // read JSON file and use CALLBACK to define what to do next
      if (err) { // if error occurs, log error
        console.error(err);
        res.end('Server Error');
      } else { // if no error
        const titles = JSON.parse(data.toString()); // parse data from JSON to text
        fs.readFile('./template.html', function(err, data) { // read html and use callback once the html is loeaded
          if (err) {
            console.error(err);
            res.end('Server Error');
          } else { // assemble HTML page showing blog titles
            const tmpl = data.toString();
            const html = tmpl.replace('%', titles.join('</li><li>')); // join() method joins all elements of an array
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html); // send HTML page to user
          }
        });
      }
    });
  }
}).listen(8000, '127.0.0.1');
// run in directory:   node Listing2.7blog_recent.1.js