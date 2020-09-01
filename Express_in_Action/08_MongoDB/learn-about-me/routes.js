var express = require("express");
var passport = require("passport");

var User = require("./models/user");
var router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }
}

router.use(function(req, res, next) {
  res.locals.currentUser = req.user; // setting request variables to local response variables
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.get("/", function(req, res, next) { // queries the users collection, returning the newest users first
  User.find() // grabbing a list of users with Users.find() 
  .sort({ createdAt: "descending" }) // sort() the results by createdAt property
  .exec(function(err, users) { // run the query with exec() , the query doesn't run until here
    if (err) { return next(err); }
    res.render("index", { users: users });
  });
});

router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res, next) {

  var username = req.body.username; // bodyParse adds the username and password to req.body
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) { // calls findOne to return just one user. You want a match on usernames here

    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists"); // if you find a user, redirect to signUp because user already exists
      return res.redirect("/signup");
    }

    var newUser = new User({ // creates a new instance of the user model with the username and password
      username: username,
      password: password
    });
    newUser.save(next); // saves the user to the database and continues to the next request handler

  });
}, passport.authenticate("login", { // authenticates the user
  successRedirect: "/",
  failureRedirect: "/signup",
  failureFlash: true
}));

router.get("/users/:username", function(req, res, next) { // profiles route
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.render("profile", { user: user });
  });
});

router.get("/edit", ensureAuthenticated, function(req, res) {
  res.render("edit");
});

router.post("/edit", ensureAuthenticated, function(req, res, next) {
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  req.user.save(function(err) {
    if (err) {
      next(err);
      return;
    }
    req.flash("info", "Profile updated!");
    res.redirect("/edit");
  });
});

module.exports = router;
