export class ZmqMiddlewareManager {
  constructor (socket) {
    // In the first part of the class, we define the constructor that accepts a ZeroMQ socket as an argument. 
    // In the constructor, we create two empty lists that will contain our middleware functions, one for inbound messages and another one for outbound messages. 
    // Next, we immediately start processing the messages coming from the socket. We do that in the handleIncomingMessages() method.
    this.socket = socket
    this.inboundMiddleware = []
    this.outboundMiddleware = []

    this.handleIncomingMessages()
      .catch(err => console.error(err))
  }

  // In the handleIncomingMessages() method, we use the ZeroMQ socket as an async iterable and with a for await...of loop, 
  // we process any incoming message and we pass it down the inboundMiddleware list of middlewares.
  async handleIncomingMessages () {
    for await (const [message] of this.socket) {
      await this
        .executeMiddleware(this.inboundMiddleware, message)
        .catch(err => {
          console.error('Error while processing the message', err)
        })
    }
  }

  // send() method will pass the message received as an argument down the outboundMiddleware pipeline.
  // The result of the processing is stored in the finalMessage variable and then sent through the socket.
  async send (message) {
    const finalMessage = await this
      .executeMiddleware(this.outboundMiddleware, message)
    return this.socket.send(finalMessage)
  }

  // The use() method is used for appending new middleware functions to our internal pipelines. 
  // In our implementation, each middleware comes in pairs; it's an object that contains two properties, inbound and outbound. 
  // Each property can be used to define the middleware function to be added to the respective list. 
  //It's important to observe here that the inbound middleware is pushed to the end of the inboundMiddleware list, while the outbound middleware is inserted (using unshift()) at the beginning of the outboundMiddleware list.
  use (middleware) {
    if (middleware.inbound) {
      this.inboundMiddleware.push(middleware.inbound)
    }
    if (middleware.outbound) {
      this.outboundMiddleware.unshift(middleware.outbound)
    }
  }

  // the part responsible for executing the middleware functions. 
  // Each function in the middleware array received as input is executed one after the other,
  // and the result of the execution of a middleware function is passed to the next.
  // Note that we are using the await instruction on each result returned by each middleware function;
  // this allows the middleware function to return a value synchronously as well as asynchronously using a promise. 
  // Finally, the result of the last middleware function is returned back to the caller.
  async executeMiddleware (middlewares, initialMessage) {
    let message = initialMessage
    for await (const middlewareFunc of middlewares) {
      message = await middlewareFunc.call(this, message)
    }
    return message
  }
}
