const User = require('../models/user');
// in Express contextual data is stored on the request object. User is stored as req.user. Middleware and routes can access the user object like this
// res.locals.user : res.local is the request level object that Express provides to expose data to templates, much like app.locals
module.exports = (req, res, next) => {
  if (req.remoteUser) { // if there is basic-auth middleware data
    res.locals.user = req.remoteUser; // modify res.locals.user with the user data loaded by the basic-auth middleware
  }
  const uid = req.session.uid;  // gets logged-in user ID from session
  if (!uid) return next();
  User.get(uid, (err, user) => { // gets logged-in user data from Redis
    if (err) return next(err);
    req.user = res.locals.user = user; // expose user data to response object
    next();
  });
};
