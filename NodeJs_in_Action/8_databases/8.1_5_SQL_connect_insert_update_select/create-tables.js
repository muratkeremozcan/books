const pg = require('pg');
const db = new pg.Client({
  database: 'articles'
}); // configuration parameters for db connection

db.connect((err, client) => { // connect to the DB
  if (err) throw err;
  console.log('Connected to database', db.database);

  // 8.2 Define a schema
  db.query(`
    CREATE TABLE IF NOT EXISTS snippets(
      id SERIAL
      PRIMARY KEY(id),
      body text
    );
  `, (err, result) => {
    if (err) throw err;
    console.log('Created table "snippets"');
    db.end();
  });
});