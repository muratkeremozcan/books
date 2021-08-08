import { EventEmitter } from 'events'

// turn the TaskQueue into an EventEmitter so that we can emit events
// to propagate task failures and to inform any observer when the queue is empty

export class TaskQueue extends EventEmitter {
  constructor (concurrency) {
    super()
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  pushTask (task) {
    this.queue.push(task)
    process.nextTick(this.next.bind(this))
    return this
  }

  next () {
    // we check that no task is running and whether the queue is empty.
    // In such a case, it means that the queue has been drained and we can fire the empty event.
    if (this.running === 0 && this.queue.length === 0) {
      return this.emit('empty')
    }

    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task((err) => {
        // we can use this.emit to fire events from within the TaskQueue next() method
        if (err) {
          this.emit('error', err)
        }
        this.running--
        process.nextTick(this.next.bind(this))
      })
      this.running++
    }
  }
}


/*
  before Promises and async await, Async.js library was the meta when working with callbacks ans asynchrony in general
  Now, the meta is promises and async await.
*/