const User = require('../models/user');

exports.form = (req, res) => { // a route that renders the registration template
  res.render('register', { title: 'Register' });
};

exports.submit = (req, res, next) => {
  var data = req.body.user;
  console.log('User:', req.body.user);
  User.getByName(data.name, (err, user) => { // check whether username is unique
    if (err) return next(err); // delegate/defer database connection errors and other errors
    if (user.id) { // is username is already taken
      res.error('Username already taken!');
      res.redirect('back');
    } else { // if username not taken
      user = new User({ name: data.name, pass: data.pass }); // create a user with POST data
      user.save((err) => { // save(cb) function
        if (err) return next(err);
        req.session.uid = user.id; // stores uid for authentication
        res.redirect('/'); // redirects to entry listing page
      });
    }
  });
};
