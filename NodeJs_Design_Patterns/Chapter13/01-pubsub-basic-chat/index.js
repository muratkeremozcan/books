import { createServer } from 'http'
import staticHandler from 'serve-handler'
import ws from 'ws'

// serve static files
const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' })
})

// we create a new instance of the WebSocket server, and we attach it to our existing HTTP server. 
// Next, we start listening for incoming WebSocket client connections by attaching an event listener for the connection event.
const wss = new ws.Server({ server })
wss.on('connection', client => {
  console.log('Client connected')
  // Each time a new client connects to our server, we start listening for incoming messages. 
  // When a new message arrives, we broadcast it to all the connected clients.
  client.on('message', msg => {
    console.log(`Message: ${msg}`)
    broadcast(msg)
  })
}) 

// The broadcast() function is a simple iteration over all the known clients,
// where the send() function is invoked on each connected client.
function broadcast (msg) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg)
    }
  }
}

server.listen(process.argv[2] || 8080)

// we only broadcast the message locally, distributing it only to the clients connected to that particular server.
// In practice, the servers that are launched are not talking to each other. 