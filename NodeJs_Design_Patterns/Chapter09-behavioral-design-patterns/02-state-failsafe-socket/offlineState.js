// Instead of using a raw TCP socket, we will use a little library called json-over-tcp-2 (nodejsdp.link/json-over-tcp-2).
// This will greatly simplify our work since the library will take care of all the parsing and formatting of the data going through the socket into JSON objects.
import jsonOverTcp from 'json-over-tcp-2'

export class OfflineState {
  constructor (failsafeSocket) {
    this.failsafeSocket = failsafeSocket
  }

  // The send() method is only responsible for queuing any data it receives. 
  // We are assuming that we are offline, so we'll save those data objects for later.
  send (data) {
    this.failsafeSocket.queue.push(data)
  }

  // The activate() method tries to establish a connection with the server using the json-over-tcp-2 socket.
  // If the operation fails, it tries again after one second. 
  // It continues trying until a valid connection is established, in which case the state of failsafeSocket is transitioned to online.
  activate () {
    const retry = () => {
      setTimeout(() => this.activate(), 1000)
    }

    console.log('Trying to connect...')
    this.failsafeSocket.socket = jsonOverTcp.connect(
      this.failsafeSocket.options,
      () => {
        console.log('Connection established')
        this.failsafeSocket.socket.removeListener('error', retry)
        this.failsafeSocket.changeState('online')
      }
    )
    this.failsafeSocket.socket.once('error', retry)
  }
}
