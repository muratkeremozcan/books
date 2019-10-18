const db = require('./db');
// connect to the database, then creates an article using Article ’s create method. 
// After that, it loads all articles and logs them out.
db().then(() => {
  db.Article.create({ title: 'An article!' }).then(() => {
    db.Article.all().then(articles => {
      console.log(articles);
      process.exit();
    });
  });
});
