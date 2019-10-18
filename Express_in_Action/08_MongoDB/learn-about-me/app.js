var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var path = require("path");
var session = require("express-session");

var app = express();
var setUpPassport = require("./setuppassport");
var routes = require("./routes"); // all routes will be in routes.js file

mongoose.connect("mongodb://localhost:27017/test"); // connects to the MongoDB server. Pass an address and Mongoose does the rest
setUpPassport();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false })); // bodyParse is used to parse form data when posting . extended:false makes parsing simpler and more secure
app.use(cookieParser());

app.use(session({ // passport's express session
  secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t", // secret allows each session to be encrypted from the clients, from hacking into users’ cookies. It needs to be a bunch of random chars
  resave: true, // resave is option required by the middleware. When it’s set to true , the session will be updated even when it hasn’t been modified.
  saveUninitialized: true //saveUninitialized is another required option. This resets sessions that are uninitialized
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});
