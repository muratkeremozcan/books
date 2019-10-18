'use strict';
const auth = require('basic-auth'); // to be able to use basic authentication
const User = require('../models/user');
const Entry = require('../models/entry'); // routing logic will be accessing entries

exports.auth = (req, res, next) => { // the basic-auth package accepts a function to perform the authentication (username, password, callback)
  const { name, pass } = auth(req);
  User.authenticate(name, pass, (err, user) => {
    if (user) req.remoteUser = user;
    next(err);
  });
};

exports.user = (req, res, next) => {
  User.get(req.params.id, (err, user) => {
    if (err) return next(err);
    if (!user.id) return res.send(404);
    res.json(user);
  });
};

exports.entries = (req, res, next) => {
  const page = req.page;
  Entry.getRange(page.from, page.to, (err, entries) => { // get entry data
    if (err) return next(err);
    res.format({ // Express provides a res.format method, which accepts an array of MIME types and callback. Express will determine what the client is willing to accept and what you're willing to provide, then invoke the appropriate callback
      'application/json': () => { // json response, if appropriate
        res.send(entries);
      },
      'application/xml': () => { // xml response, if appropriate
        res.render('entries/xml', { entries: entries });
      }
    });
  });
};
