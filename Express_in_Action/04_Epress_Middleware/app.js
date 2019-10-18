var express = require('express');
var path = require('path'); // built-in node module which will let you determine the path the user requests
var fs = require('fs'); // will be used to determine if a file exists
var app = express(); // creates an Express application and puts it inside a variable

app.use((req, res, next) => { // logs incoming request with req. parameters
  console.log('Request IP : ' + req.url);
  console.log('Request method : ' + req.method);
  console.log('Request date : ' + new Date());
  next();
});

app.use((req, res, next) => {
  var filePath = path.join(__dirname, 'static', req.url); // path.join is used to determine where the file should be
  fs.stat(filePath, (err, fileInfo) => { // built-in fs.stat is used to get info about a file
    if (err) {
      next(); // if fs.stat fails, continue to the next middleware
      return;
    }
    if (fileInfo.isFile()) { // isFile() method is used to determine if a file exists
      res.sendFile(filePath, function(err) { // respond with the file requested in the file path
        if (err) { // if  cannot find the file, throw error
          next(new Error("Error sending file!")); // to enter error mode, call next with an argument
        }
      });
    } else {
      next(); // otherwise continue to the next middleware
    }
  });
});


app.use((req, res) => { // next arg. isn't needed because this is the final middleware
  res.status(404).send('File not found!');
});

app.listen(3000, () => {
  console.log('App started on port 3000');
});