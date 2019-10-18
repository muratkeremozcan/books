const pg = require('pg');
const db = new pg.Client({
  database: 'articles'
});

db.connect((err, client) => {
  if (err) throw err;
  console.log('Connected to database', db.database);

  // INSERT string into the table
  const body = 'hello world';
  db.query(`
    INSERT INTO snippets (body) VALUES (
      '${body}'
    )
    RETURNING id
  `, (err, result) => {
    if (err) throw err;
    const id = result.rows[0].id; // the table goes to result. First row's id is set as id
    console.log('Inserted row with id %s', id);

    // UPDATE
    db.query(`
      UPDATE snippets SET (body) = (
      '${body}'
      ) WHERE id=${id};
    `, (err, result) => {
      if (err) throw err;
      console.log('Updated %s rows.', result.rowCount);

      // SELECT
      db.query(`
      SELECT * FROM snippets ORDER BY id
    `, (err, result) => {
        if (err) throw err;
        console.log(result.rows);

        db.end();
      });
    });
  });
});