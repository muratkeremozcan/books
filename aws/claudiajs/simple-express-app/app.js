const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

global.cachedDb = null; // cache the database connection

function connectToDatabase(uri) {
  // check if the db connection is cached, if so, return it
  if (global.cachedDb && global.cachedDb.serverConfig.isConnected()) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }
  // otherwise create a new connection and cache it
  return MongoClient.connect(uri)
    .then(client => {
      cachedDb = client.db('taxi')
      console.log('not cached');
      return cachedDb;
    })
}

app.use(bodyParser.json());

// serve static (html) content from the static folder
app.use('/static', express.static('static'));

app.get('/', (req, res) => res.send('Hello World!'));

// find all the orders and convert them to an array
app.get('/orders', (req, res) => {
  connectToDatabase(process.env.MONGODB_CONNECTION_STRING)
    .then((db) => db.collection('orders').find().toArray())
    .then(result => res.send(result))
    .catch(err => res.send(err).status(400))
})

app.post('/orders', (req, res) => {
  connectToDatabase(process.env.MONGODB_CONNECTION_STRING)
    .then((db) => db.collection('orders').insertOne({
        address: req.body.address
      })
    )
    .then(result => res.send(result))
})

app.delete('/orders/:id', (req, res) => {
  connectToDatabase(process.env.MONGODB_CONNECTION_STRING)
    .then((db) => db.collection('orders').collection.deleteOne({
        _id: new mongodb.ObjectID(req.params.id) // Because the order ID is passed as a string, you need to convert it to a MongoDB ID using the new mongodb.ObjectID( req.params.id) function
      })
    )
    .then(result => res.send(result))
    .catch(err => res.send(err).status(400))
})

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`App listening on port ${port}`));
// to convert the express app to serverless export, the application instance instead of running the app.listen function
// instead, you move the app.listen into an app-local.js file and import the app from here
module.exports = app;

/*
Running an HTTP server inside AWS Lambda sounds like an anti-pattern, and it has multiple downsides, such as increased execution time and function size. 
But it also has many upsides, such as preserving the existing codebase and avoiding vendor lock-in.

Note that AWS Lambda with the GoLang runtime uses a similar approach to run the function.
*/