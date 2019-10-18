'use strict';
const express = require('express');

function message(req) {
  return (msg, type) => {
    type = type || 'info';
    let sess = req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({ type: type, string: msg });
  };
};

module.exports = (req, res, next) => {
  res.message = message(req); // res.message function provides a way to add messages to a session variable from any Express request
  res.error = (msg) => { // res.error function allows you to add message of type error
    return res.message(msg, 'error');
  };
  res.locals.messages = req.session.messages || []; // expose the above messages . Populate res.locals.messages with the contents of res.session.messages on each request
  res.locals.removeMessages = () => { // need a way to clear messages
    req.session.messages = [];
  };
  next();
};
