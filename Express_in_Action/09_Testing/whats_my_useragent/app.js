var express = require("express");
var path = require("path");
var app = express();

app.set('port', process.env.PORT || 3000);

var viewsPath = path.join(__dirname, 'views'); // setup views path
app.set('view engine', 'ejs'); // sets ejs as the view engine
app.set('views', viewsPath); // uses the views directory as the views path

app.get('/', (req, res) => {
  var userAgent = req.headers["user-agent"] || "none";

  if (req.accepts('html')) { // if the request accepts html, render the index template
    res.render('index', {
      userAgent: userAgent
    });
  } else { // otherwise send the user agent string as plain text
    res.type('text');
    res.send(req.headers["user-agent"]); // code that returns the User-Agent header
  }
});

app.listen(app.get('port'), () => { // listen with app.get('port')
  console.log('App started on port ' + app.get('port'));
});

module.exports = app; // when you’re testing the application you’ll need to export it so that the outside world can poke at it and test it