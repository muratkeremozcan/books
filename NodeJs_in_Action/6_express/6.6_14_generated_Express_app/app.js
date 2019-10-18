var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');  // serves default favicon
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const entries = require('./routes/entries');
var routes = require('./routes/index');
var users = require('./routes/users');
const validate = require('./middleware/validate');

var app = express();


// API routes
// GET /api/entries: Get a list of entries
// GET /api/entries/page: Get a single page of entries
// POST /api/entry: Create a new shoutbox entry
// Web UI routes
// GET /post: The form for a new entry
// POST /post: Post a new entry
// GET /register: Show the registration form
// POST /register: Create a new account
// GET /login: Show the sign-in form
// POST /login: Sign in
// GET /logout: Sign out


// __dirname: global variable in Node for CWD in development, or a consistent directory in production
app.set('views', path.join(__dirname, 'views')); // CONFIGURING the VIEWS setting: specifies the directory Express will use during view lookup. To get the full directory name, the path.join() method joins all given path segments together. https://nodejs.org/api/path.html#path_path_join_paths
app.set('view engine', 'ejs'); // CONFIGURING the VIEW ENGINE: enables you to render ejs files correctly
app.set('json spaces', 2); // if you add this option, JSON will be printed  in a more readable format

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); // ouputs dev friendly colored logs
app.use(bodyParser.json()); // parses request bodies
app.use(bodyParser.urlencoded({ extended: true })); // the form input uses names like entry[title], therefore extended body parsing is required
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // serves static files from ./public

app.use('/', routes); // serves application routes
app.use('/users', users);

app.get('/', entries.list);
// capability to add entries
app.get('/post', entries.form); 
app.post('/post', entries.submit);

exports.form = (req, res) => { // render a template containing form
  res.render('post', { title: 'Post' });
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') { // displays styled HTML error pages in development.
  app.use(function(err, req, res, next) { // if a string is passed, the callback is immediately invoked. When a function is given, it is invoked for all environments
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
