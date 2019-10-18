var fs = require('fs'); // file stream module of Node

fs.readFile("myfile.txt", 'utf-8', function(err, data) { // once the file is read, the callback function is run
  if (err) {
    console.error('Error reading file');
    return;
  }
  console.log(data.match(/x/gi).length + " letter X's "); // prints x's using a regex
});

console.log('Hello World (will run first)');
// in bash:  node index.js