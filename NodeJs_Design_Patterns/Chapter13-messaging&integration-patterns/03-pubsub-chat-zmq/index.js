import { createServer } from 'http'
import staticHandler from 'serve-handler'
import ws from 'ws'
// we import yargs (nodejsdp.link/yargs), which is a command-line argument parser;
// we need this to easily accept named arguments
import yargs from 'yargs'
import zmq from 'zeromq'

// serve static files
const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' })
})

let pubSocket

// In the initializeSockets() function, we immediately create our Publisher socket and bind it to the port provided in the --pub command-line argument. 
async function initializeSockets () {
  pubSocket = new zmq.Publisher()
  await pubSocket.bind(`tcp://127.0.0.1:${yargs.argv.pub}`)

  // We create the Subscriber socket and we connect it to the Publisher sockets of the other instances of our application.
  const subSocket = new zmq.Subscriber()
  const subPorts = [].concat(yargs.argv.sub)

  // The ports of the target Publisher sockets are provided in the --sub command-line arguments (there might be more than one).
  // We then create the actual subscription, by providing chat as a filter, which means that we will receive only the messages beginning with chat.
  for (const port of subPorts) {
    console.log(`Subscribing to ${port}`)
    subSocket.connect(`tcp://127.0.0.1:${port}`)
  }
  subSocket.subscribe('chat')

  // We start listening for messages arriving at our Subscriber socket using a for await...of loop, since subSocket is an async iterable.
  // With each message we receive, we do some simple parsing to remove the chat prefix,
  // and then we broadcast() the actual payload to all the clients connected to the current WebSocket server.
  for await (const [msg] of subSocket) {
    console.log(`Message from another server: ${msg}`)
    broadcast(msg.toString().split(' ')[1])
  }
}

initializeSockets()

const wss = new ws.Server({ server })
wss.on('connection', client => {
  console.log('Client connected')
  client.on('message', msg => {
    console.log(`Message: ${msg}`)
    broadcast(msg)
    // When a new message is received by the WebSocket server of the current instance,
    // we broadcast it to all the connected clients but we also publish it through our Publisher socket. 
    // We use chat as a prefix followed by a space, so that the message will be published to all the subscriptions using chat as a filter.
    pubSocket.send(`chat ${msg}`)
  })
})

function broadcast (msg) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg)
    }
  }
}

server.listen(yargs.argv.http || 8080)

// node index.js --http 8080 --pub 5000 --sub 5001 --sub 5002
// node index.js --http 8081 --pub 5001 --sub 5000 --sub 5002
// node index.js --http 8082 --pub 5002 --sub 5000 --sub 5001
