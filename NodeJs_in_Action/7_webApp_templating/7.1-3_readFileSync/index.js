const fs = require('fs');
const http = require('http');

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
// console.log(entries);

// 7.3: rendering without a template . We have to write a whole function with html & css in the code
function blogPage(entries) {
  let output = `
    <html>
    <head>
      <style type="text/css">
        .entry_title { font-weight: bold; }
        .entry_date { font-style: italic; }
        .entry_body { margin-bottom: 1em; }
      </style>
    </head>
    <body>
  `;
  entries.map(entry => {
    output += `
      <div class="entry_title">${entry.title}</div>
      <div class="entry_date">${entry.date}</div>
      <div class="entry_body">${entry.body}</div>
    `;
  });
  output += '</body></html>';
  return output;
}

// if you want to test console output when you run the server...
// console.log(blogPage([{
//   title: 'test',
//   date: 'now',
//   body: 'hi'
// }]));

// Defines an HTTP server.
// When the server receives an HTTP request, it returns a page containing all blog entries.
// This page is rendered using a function called blogPage
const server = http.createServer((req, res) => {
  const output = blogPage(entries);
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end(output);
});
server.listen(3000);