const User = require('../models/user');

exports.form = (req, res) => { // a route that renders login template
  res.render('login', { title: 'Login' });
};

exports.submit = (req, res, next) => {
  const data = req.body.user;
  User.authenticate(data.name, data.pass, (err, user) => {  // check credentials
    if (err) return next(err); // delegate/defer database connection errors and other errors
    if (user) { // for a user with valid credentials
      req.session.uid = user.id; // store uid for authentication
      res.redirect('/'); // redirect entry listing
    } else { // if not valid credentials
      res.error('Sorry! invalid credentials. ');
      res.redirect('back');
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/');
  })
};
