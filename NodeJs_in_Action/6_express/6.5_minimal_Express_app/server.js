const express = require('express');
const app = express();

app.get('/', (req, res) => { // responds to any web request coming to '/'
  res.send('Hello'); // sends 'Hello' as response text
});
app.listen(3000); // listens on port 3000