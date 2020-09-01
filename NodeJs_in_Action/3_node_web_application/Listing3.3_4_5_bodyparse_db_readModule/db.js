const sqlite3 = require('sqlite3').verbose();
const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName); // a database file is opened by using sqlite3.Database

db.serialize(() => { // creates an "articles" table if there isn't one
  const sql = `
  CREATE TABLE IF NOT EXISTS articles
  (id integer primary key, title, content TEXT)
`;
  db.run(sql); // sqlite3.run is used to create data
}); // when the database and table are ready, the application is ready to make queries

// NOTE ABOUT STATIC
// STATIC METHOD: these are used to define method on class level as opposed to instance level
// IMPORTANT: object instances do not have access to static method
// IMPORTANT: only the class itself has access to the static method
class Article { // can fetch, create, delete data
  static all(cb) {
    db.all('SELECT * FROM articles', cb); // gets all articles with sqlite3.all method
  }

  static find(id, cb)  {
    db.get('SELECT * FROM articles WHERE id = ?', id, cb); // selects a specific article, sqlite3.get method, using the ? query syntax with value
  }

  static create(data, cb) {
    const sql = `INSERT INTO articles(title, content) VALUES (?, ?)`; // specifies parameters with question marks, sqlite3.run is used to create (or delete) data
    db.run(sql, data.title, data.content, cb);
  }

  static delete(id, cb) {
    if (!id) return cb(new Error('Please provide an id'));
    db.run('DELETE FROM articles WHERE id = ?', id, cb);  // db run can also be used to delete data
  }
}

module.exports = db;
module.exports.Article = Article;