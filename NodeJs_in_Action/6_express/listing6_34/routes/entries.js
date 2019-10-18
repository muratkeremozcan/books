const Entry = require('../models/entry');

exports.list = (req, res, next) => {
  const page = req.page;
  Entry.getRange(0, -1, (err, entries) => { // retrieves entries
    if (err) return next(err);
    res.render('entries', { // renders HTTP response
      title: 'Entries',
      entries: entries
    });
  });
};

exports.form = (req, res) => {
  res.render('post', { title: 'Post' });
};

exports.submit = (req, res, next) => {
  const data = req.body.entry;  // comes from name="entry[...]" in the form . links to post.ejs entry[title], entry[body]
  const user = res.locals.user; // middleware for loading users
  const username = user ? user.name : null;
  const entry = new Entry({
    username: username,
    title: data.title, // entry[title]
    body: data.body    // etnry[body]
  });

  entry.save((err) => {
    if (err) return next(err);
    if (req.remoteUser) {
      res.json({ message: 'Entry added.' });
    } else {
      res.redirect('/');
    }
  });
};
