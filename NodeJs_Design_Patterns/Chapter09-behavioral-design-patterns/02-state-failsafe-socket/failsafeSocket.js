import { OfflineState } from './offlineState.js'
import { OnlineState } from './onlineState.js'

export class FailsafeSocket {
  // The constructor initializes various data structures, 
  // including the queue that will contain any data sent while the socket is offline. 
  // Also, it creates a set of two states: one for implementing the behavior of the socket while it's offline,
  // and another one when the socket is online.
  constructor (options) {
    this.options = options
    this.queue = []
    this.currentState = null
    this.socket = null
    this.states = {
      offline: new OfflineState(this),
      online: new OnlineState(this)
    }
    this.changeState('offline')
  }

  // The changeState() method is responsible for transitioning from one state to another. 
  // It simply updates the currentState instance variable and calls activate() on the target state.
  changeState (state) {
    console.log(`Activating state: ${state}`)
    this.currentState = this.states[state]
    this.currentState.activate()
  }

  // The send() method contains the main functionality of the FailsafeSocket class. 
  // This is where we want to have a different behavior based on the offline/online state. 
  // As we can see, this is done by delegating the operation to the currently active state.
  send (data) {
    this.currentState.send(data)
  }
}
