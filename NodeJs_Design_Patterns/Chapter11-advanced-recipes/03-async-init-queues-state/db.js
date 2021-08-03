import { EventEmitter } from 'events'

const METHODS_REQUIRING_CONNECTION = ['query']
const deactivate = Symbol('deactivate')

class InitializedState {
  async query (queryString) {
    console.log(`Query executed: ${queryString}`)
  }
}

class QueuingState {
  constructor (db) {
    this.db = db
    this.commandsQueue = []

    // For each method that requires an active connection, we create a new method for the current instance,
    // which queues a new command representing the function invocation. 
    // When the command is executed at a later time, when a connection is established, 
    // the result of the invocation of the method on the db instance is forwarded to the caller (through the returned promise).
    METHODS_REQUIRING_CONNECTION.forEach(methodName => {
      this[methodName] = function (...args) {
        console.log('Command queued:', methodName, args)
        return new Promise((resolve, reject) => {
          const command = () => {
            db[methodName](...args)
              .then(resolve, reject)
          }
          this.commandsQueue.push(command)
        })
      }
    })
  }

  // This method is invoked when the state is deactivated (which is when the component is initialized) 
  // and it executes all the commands in the queue. Note how we used a Symbol to name the method.
  [deactivate] () {
    this.commandsQueue.forEach(command => command())
    this.commandsQueue = []
  }
}

class DB extends EventEmitter {
  // In the constructor, we initialize the current state of the instance. 
  // It's going to be the QueuingState as the asynchronous initialization of the component hasn't been completed yet.
  constructor () {
    super()
    this.state = new QueuingState(this)
  }

  // The only method of our class implementing some (stub) business logic is the query() method. 
  // Here, all we have to do is invoke the homonymous method on the currently active state.
  async query (queryString) {
    return this.state.query(queryString)
  }

  connect () {
    // simulate the delay of the connection
    setTimeout(() => {
      this.connected = true
      this.emit('connected')
      // Finally, when we establish the connection with the database (initialization complete), we switch the current state to the InitializedState we deactivate the old one
      // The effect of deactivating the QueuedState, as we've seen previously, is that any command that had been queued is now executed.
      const oldState = this.state
      this.state = new InitializedState(this)
      oldState[deactivate] && oldState[deactivate]()
    }, 500)
  }
}

export const db = new DB()
