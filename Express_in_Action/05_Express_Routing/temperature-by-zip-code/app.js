var path = require('path'); // node's built-in path module provides utilities for working with file and directory paths
var zipdb = require('zippity-do-dah'); // for turning ZIP Codes into latitude/longitude pairs
var ForecastIo = require('forecastio'); // or grabbing weather data from the free API called Forecast.io
var express = require('express');

var app = express();
var weather = new ForecastIo('18c4216fbd45f590867261e7d64ac983'); // create a ForecastIo object with the api key. Sign up and register your api key at https://darksky.net/dev/register

app.use(express.static(path.resolve(__dirname, 'public'))); // express static file server using public folder in cwd

// setting up view template
app.set('views', path.resolve(__dirname, 'views')); // // CONFIGURING the VIEWS setting: specifies the directory Express will use during view lookup. Resolves a sequence of paths or path segments into an absolute path https://nodejs.org/api/path.html#path_path_join_paths
app.set('view engine', 'ejs'); // // CONFIGURING the VIEW ENGINE: enables you to render ejs files correctly

app.get('/', (req, res) => { // index view if one hits the home pag
  res.render('index'); // RESPONSE.RENDER renders a html template (render the file index.ejs) Renders a view and sends the rendered HTML string to the client http://expressjs.com/en/4x/api.html#res.render
});

app.get(/^\/(\d{5})$/, (req, res, next) => { // route for a 5 digit zip code (regex capture). You can use Regex to define routes. No quotes ' ', but reegx expression /^ ... $/
  var zipcode = req.params[0]; // Regex defined routes get passed in as req.params[0] for the 1st captured parameter
  var location = zipdb.zipcode(zipcode); // using zipdb's zipcode() function to find the location of the zip
  if (!location.zipcode) { // Returns {} when no results are found. Continues if the object isn’t empty
    next();
    return;
  }

  var latitude = location.latitude;
  var longitude = location.longitude;

  weather.forecast(latitude, longitude, function (err, data) {
    if (err) {
      next();
      return;
    }

    res.json({ // Sends this JSON  object with Express’s json method
      zipcode: zipcode,
      temperature: data.currently.temperature
    });
  });
});

app.use((req,res) => { // 404 if no other routes are matched
  res.status(404).render('Page not found!');
});

app.listen(3000, () => { // listening on port 3000
  console.log('App started on port 3000');
});