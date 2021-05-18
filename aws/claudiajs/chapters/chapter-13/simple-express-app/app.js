'use strict'

const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')

global.cachedDb = null

function connectToDatabase(uri) {
  if (global.cachedDb && global.cachedDb.serverConfig.isConnected()) {
    console.log('=> using cached database instance')
    return Promise.resolve(cachedDb)
  }

  return MongoClient.connect(uri)
    .then(client => {
      cachedDb = client.db('taxi')
      console.log('Not cached')
      return cachedDb
    })
}

app.use(bodyParser.json())

app.use('/static', express.static('static'))

app.get('/claudia', (req, res) => {
  res.sendFile(`${__dirname}/static/claudiajs.png`)
})

app.get('/', (req, res) => res.send('Hello world'))

app.get('/orders', (req, res) => {
  connectToDatabase(process.env.MONGODB_CONNECTION_STRING)
    .then((db) => {
      console.log(db)
      return db.collection('orders').find().toArray()
    })
    .then(result => {
      console.log('result', result)
      return res.send(result)
    })
    .catch(err => res.send(err).status(400))
})

app.post('/orders', (req, res) => {
  connectToDatabase(process.env.MONGODB_CONNECTION_STRING)
    .then((db) => {
      return db.collection('orders').insertOne({
        address: req.body.address
      })
    })
    .then(result => res.send(result))
})

app.delete('/orders/:id', (req, res) => {
  connectToDatabase(process.env.MONGODB_CONNECTION_STRING)
    .then((db) => {
      return db.collection('orders').collection.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
      })
    })
    .then(result => res.send(result))
    .catch(err => res.send(err).status(400))
})

module.exports = app
