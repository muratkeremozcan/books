import zeromq from 'zeromq'
import { ZmqMiddlewareManager } from './zmqMiddlewareManager.js'
import { jsonMiddleware } from './jsonMiddleware.js'
import { zlibMiddleware } from './zlibMiddleware.js'

async function main () {
  // Next, in the main() function, we create a new ZeroMQ Reply socket and bind it to port 5000 on localhost.
  const socket = new zeromq.Reply()
  await socket.bind('tcp://127.0.0.1:5000')

  // we wrap ZeroMQ with our middleware manager and then add the zlib and JSON middlewares.
  const zmqm = new ZmqMiddlewareManager(socket)
  zmqm.use(zlibMiddleware())
  zmqm.use(jsonMiddleware())
  // Finally, we are ready to handle a request coming from the client. 
  // We will do this by simply adding another middleware, this time using it as a request handler.
  zmqm.use({
    async inbound (message) {
      console.log('Received', message)
      if (message.action === 'ping') {
        await this.send({ action: 'pong', echo: message.echo })
      }
      return message
    }
  })

  console.log('Server started')
}

main()
