var bcrypt = require("bcrypt-nodejs"); // bycrpt works by running a part of the algorithm many times to give you a secure hash...
var mongoose = require("mongoose");

var SALT_FACTOR = 10; // ...that number of times is configurable. The higher the number, the more secure the hash

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  displayName: String,
  bio: String
});

// pre-save action . Before the model is saved to that database, run the code that will hash the password
// with this code, hashing will happen every time you save the model into mongo
// A model is a representation of a database record as a nice (JS) object  (or language of choice) . Models can serve as simple objects that store database values
var noop = function() {}; // a do-nothing function for use with the bycrypt module
userSchema.pre("save", function(done) { // schema.pre : for defining a function to run before the model is saved
  var user = this; // save a reference to the user

  if (!user.isModified("password")) { // if password is not modified, skip all logic. Default password needs to be modified
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) { // Generates a salt for the hash, and calls the inner function once completed
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword; // stores the password and continues with saving
      done();
    });
  });
});

userSchema.methods.checkPassword = function(guess, done) { //  code to compare the real password to a password guess
  bcrypt.compare(guess, this.password, function(err, isMatch) { // we use bcrypt.compare instead of a simple equality check. This is for security reasons, to prevent timing attacks
    done(err, isMatch); 
  });
};

userSchema.methods.name = function() {  // schema.methods.<methodName>
  return this.displayName || this.username; // if the user has defined a displayName return that, otherwise return their username
};

var User = mongoose.model("User", userSchema); // attaching the schema created here to the actual model (User)
module.exports = User; // exporting the model so that other files can require it

