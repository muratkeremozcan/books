const app = express();
const session = require('express-session'); // Manages session data. Provides an API that can be extended to suit different databases
const bodyParser = require('body-parser'); // Consumes and parses the request body into req.body
const cookieParser = require('cookie-parser'); // Parses cookies from web browsers into req.cookies
const logger = require('morgan'); // The morgan module request . logging middleware component with customizable log formats
const path = require('path'); // path module provides utilities for working with file and directory paths
// MIDDLEWARE
const messages = require('./middleware/messages');
const page = require('./middleware/page');
const user = require('./middleware/user');
const validate = require('./middleware/validate');
// MODELS
const Entry = require('./models/entry');
// ROUTES (url handling code: pair URL with middleware)
const api = require('./routes/api');
const entries = require('./routes/entries');
const login = require('./routes/login');
const register = require('./routes/register');
const users = require('./routes/users');
// VIEWS note
// ROUTES render VIEWs.  Express provides 2 ways to render views:
// * app.render() at application level
// * res.render() at response
// When res.render() or app.render() is invoked, Express first checks whether a file exists at an absolute path.
// Next, Express looks relative to the views directory.
// Finally, Express tries an index file

// view engine setup. Enables to view the ejs files in views folder
app.set('views', path.join(__dirname, 'views'));  // CONFIGURING the VIEWS setting: specifies the directory Express will use during view lookup. To get the full directory name, the path.join() method joins all given path segments together. https://nodejs.org/api/path.html#path_path_join_paths
app.set('view engine', 'ejs');  // CONFIGURING the VIEW ENGINE: enables you to render ejs files correctly
app.set('json spaces', 2);  // if you add this option, JSON will be printed  in a more readable format

// USE imports
app.use(logger('dev')); // ouputs dev friendly colored logs
app.use(bodyParser.json()); // parses request bodies
app.use(bodyParser.urlencoded({ extended: true })); // the form input uses names like entry[title], therefore extended body parsing is required
app.use(cookieParser()); // cookie middleware
app.use(session({ // session support . Best to insert after cookie middleware
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(messages); // use MIDDLEWARE/messages.js . Best to insert after session middleware because it depends on req.session being defined
app.use(express.static(path.join(__dirname, 'public')));

// API routes
// app.use() method can be passed a path name, EXPRESS MOUNT POINT. With this, pathnames beginning with /api and any HTTP ver will cause this middleware to be invoked
app.use('/api', api.auth); // use ROUTES/api.js  . Should be placed before app.use(user) to later modify the user-loading middleware to load data for authenticated API users.
app.get('/api/user/:id', api.user); // use ROUTE/api.js . GET /api/user/:id . Get the user by id, respond with 404 not found if user doesn't exist, otherwise user.data is passed to res.send
// app.get('/api/entries/:page?', api.entries); // GET /api/entries: Get a list of entries
// app.post('/api/entry', api.add);
app.post('/api/entry', entries.submit); // POST /api/entry: Create a new shoutbox entry
app.get('/api/entries/:page?', page(Entry.count), api.entries); // GET /api/entries/page: Get a single page of entries
app.use(user); // use MIDDLEWARE/user.js
app.use('/users', users); // use ROUTES/users.js

// Web UI routes
app.get('/', entries.list); // use ROUTES/entries.js . list all entries
app.get('/post', entries.form); // use ROUTES/entries.js . GET /post: The form for a new entry
app.post('/post', // use MIDDLEWARE/validate.js and ROUTES/.entries.js .  POST /post: Post a new entry
  validate.required('entry[title]'),
  validate.lengthAbove('entry[title]', 4),
  entries.submit);

app.get('/login', login.form);  // use ROUTES/login.js .  GET /login: Show the sign-in form
app.post('/login', login.submit); // use ROUTES/login.js .   POST /login: Sign in
app.get('/logout', login.logout); // use ROUTES/login.js .   GET /logout: Sign out
app.get('/register', register.form); // use ROUTES/register.js  . GET /register: Show the registration form
app.post('/register', register.submit); // use ROUTES/register.js  . POST /register: Create a new account

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') { // displays styled HTML error pages in development.
  app.use((err, req, res) => { // if a string is passed, the callback is immediately invoked. When a function is given, it is invoked for all environments
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
