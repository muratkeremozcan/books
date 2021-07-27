import { EventEmitter } from 'events'

class DB extends EventEmitter {
  connected = false
  commandsQueue = []

  async query (queryString) {
    if (!this.connected) {
      console.log(`Request queued: ${queryString}`)
      // If the component has not been initialized—which, in our case, is when the connected property is false-
      // we create a command from the parameters received with the current invocation and push it to the commandsQueue array. 
      // When the command is executed, it will run the original query() method again
      // and forward the result to the Promise we are returning to the caller.

      return new Promise((resolve, reject) => {
        const command = () => {
          this.query(queryString)
            .then(resolve, reject)
        }
        this.commandsQueue.push(command)
      })
    }
    console.log(`Query executed: ${queryString}`)
  }

  connect () {
    // simulate the delay of the connection
    setTimeout(() => {
      this.connected = true
      this.emit('connected')
      // When the initialization of the component is completed—which, in our case, means that the connection with the database server is established—
      // we go through the commandsQueue, executing all the commands that have been previously queued.
      this.commandsQueue.forEach(command => command())
      this.commandsQueue = []
    }, 500)
  }
}

export const db = new DB()
