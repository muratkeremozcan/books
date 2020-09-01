'use strict';

function parseField(field) { // parses entry[name] notation
  return field
    .split(/\[|\]/)
    .filter((s) => s);
}

function getField(req, field) { // looks up property based on parseField() results
  let val = req.body;
  field.forEach((prop) => {
    val = val[prop];
  });
  return val;
}

exports.required = (field) => {
  field = parseField(field); // parses field once
  return (req, res, next) => {
    if (getField(req, field)) { // on each request, checks whether field has a value
      next(); // if it does, moves on to the next middleware component
    } else {
      res.error(`${field.join(' ')} is required`);
      res.redirect('back');
    }
  };
};

exports.lengthAbove = (field, len) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field).length > len) { 
      next();
    } else {
      const fields = field.join(' ');
      res.error(`${fields} must have more than ${len} characters`); // if it doesn't, displays an error
      res.redirect('back');
    }
  };
};

