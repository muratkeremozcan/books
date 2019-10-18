var express = require('express');
var path = require('path');
var apiRouter = require('./routes/api_router'); // requires the api router
var app = express();

// path.join() only concatenates the input list with platform specific separator
// while the path.resolve() processes the sequence of paths from right to left, with each subsequent path prepended until an absolute path is constructed.
// console.log(path.resolve(__dirname, 'static'));
// console.log(path.join(__dirname, 'static'));
// note: they gave the same result....

var staticPath = path.resolve(__dirname, 'static');
app.use(express.static(staticPath)); // instead of our own file server middleware, can use express.static . If the file exists, it sends it, if not it will continue to the next middleware stack
// all the error checking is done for us, with performance and security improvements

app.use('/api', apiRouter); // uses the api router

app.listen(3000, () => {
  console.log('listening on port 3000');
});

/* SERVING STATIC FILES TO DIFFERENT ROUTES

var publicPath = path.resolve(__dirname, 'public');
var userUploadsPath = path.resolve(__dirname, 'user_uploads');

app.use('public', express.static(publicPath));
app.use('uploads', express.static(userUploadsPath));

ROUTING TO STATIC FILES
app.get("/users/:userid/profile_photo", function(req, res) {
  res.sendFile(getProfilePhotoPath(req.params.userid));
});
*/