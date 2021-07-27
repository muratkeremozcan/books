export class OnlineState {
  constructor (failsafeSocket) {
    this.failsafeSocket = failsafeSocket
    this.hasDisconnected = false
  }

  // The send() method queues the data and then immediately tries to write it directly into the socket, 
  // as we assume that we are online. It'll use the internal _safeWrite() method to do that.
  send (data) {
    this.failsafeSocket.queue.push(data)
    this._safeWrite(data)
  }

  // The _safeWrite() method tries to write the data into the socket writable stream (see the official docs at nodejsdp.link/writable-write) 
  // and it waits for the data to be written into the underlying resource. 
  // If no errors are returned and if the socket didn't disconnect in the meantime, 
  // it means that the data was sent successfully and therefore we remove it from the queue.
  _safeWrite (data) {
    this.failsafeSocket.socket.write(data, (err) => {
      if (!this.hasDisconnected && !err) {
        this.failsafeSocket.queue.shift()
      }
    })
  }

  // The activate() method flushes any data that was queued while the socket was offline 
  // and it also starts listening for any error event; we will take this as a symptom that the socket went offline (for simplicity). 
  // When this happens, we transition to the offline state.
  activate () {
    this.hasDisconnected = false
    for (const data of this.failsafeSocket.queue) {
      this._safeWrite(data)
    }

    this.failsafeSocket.socket.once('error', () => {
      this.hasDisconnected = true
      this.failsafeSocket.changeState('offline')
    })
  }
}
