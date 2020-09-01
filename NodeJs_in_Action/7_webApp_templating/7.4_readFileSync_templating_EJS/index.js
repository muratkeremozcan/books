const fs = require('fs');
const http = require('http');
const ejs = require('ejs');
const template = fs.readFileSync('./templates/blog_page.ejs', 'utf8');

function getEntries() { // function to read and parse blog entry
  const entries = [];
  let entriesRaw = fs.readFileSync('./entries.txt', 'utf8'); // C:/UserData/ozcanm/Documents/TRAINING/Books/NodeJs_in_Action/7_webApp_templating/7.1,2_readFileSync
  entriesRaw = entriesRaw.split('---'); // parse text into individual blog entries
  entriesRaw.map((entryRaw) => {
    const entry = {};
    const lines = entryRaw.split('\n'); // parse entry text into individual lines
    lines.map((line) => {
      if (line.indexOf('title: ') === 0) {
        entry.title = line.replace('title: ', ''); // assign line to a property and replace the string
      } else if (line.indexOf('date: ') === 0) {
        entry.date = line.replace('date: ', ''); // assign line to a property and replace the string
      } else {
        entry.body = entry.body || ''; // if it's not a property it's the body
        entry.body += line; // every line in body gets added
      }
    });
    entries.push(entry);
  });
  return entries;
}
const entries = getEntries();

// 7.4: rendering with template: we are reading the ejs template file which contains HTML and CSS and placeholders where data passed to the template should be put
function blogPage(entries) {
  const values = { entries };
  return ejs.render(template, values);
}

// Defines an HTTP server.
// When the server receives an HTTP request, it returns a page containing all blog entries.
// This page is rendered using a function called blogPage
const server = http.createServer((req, res) => {
  const output = blogPage(entries); // the entries get passed in to the blogPage function, which renders the array per the template
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end(output);
});
server.listen(3000);