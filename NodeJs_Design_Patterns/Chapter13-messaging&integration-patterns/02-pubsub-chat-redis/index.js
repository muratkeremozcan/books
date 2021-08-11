import { createServer } from 'http'
import staticHandler from 'serve-handler'
import ws from 'ws'
import Redis from 'ioredis'
// To connect our Node.js application to the Redis server, we use the ioredis package (nodejsdp.link/ioredis),
// which is a complete Node.js client supporting all the available Redis commands.
// Next, we instantiate two different connections, one used to subscribe to a channel, the other to publish messages.
// This is necessary in Redis, because once a connection is put in subscriber mode, only commands related to the subscription can be used.
// This means that we need a second connection for publishing messages. 
const redisSub = new Redis()
const redisPub = new Redis()

// serve static files
const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' })
})

// When a new message is received from a connected client, we publish the message in the chat_messages channel. 
// We don't directly broadcast the message to our clients because our server is subscribed to the same channel,
// so it will come back to us through Redis. 
// depending on the requirements of your application, you may instead want to broadcast the message immediately 
// and ignore any message arriving from Redis and originating from the current server instance.
const wss = new ws.Server({ server })
wss.on('connection', client => {
  console.log('Client connected')
  client.on('message', msg => {
    console.log(`Message: ${msg}`)
    redisPub.publish('chat_messages', msg)
  })
})

// our server also has to subscribe to the chat_messages channel, so we register a listener to receive all the messages published into that channel
// When a message is received, we simply broadcast it to all the clients connected to the current WebSocket server.
redisSub.subscribe('chat_messages')
redisSub.on('message', (channel, msg) => {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg)
    }
  }
})

server.listen(process.argv[2] || 8080)

// Redis allows us to publish and subscribe to channels identified by a string, for example, chat.nodejs. 
// But it also allows us to use glob-style patterns to define subscriptions that can potentially match multiple channels, for example, chat.*.

// node index.js 8080
// node index.js 8081
// node index.js 8082
