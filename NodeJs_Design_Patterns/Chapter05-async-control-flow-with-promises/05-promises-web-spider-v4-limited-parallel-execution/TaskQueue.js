export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  runTask (task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => { 
        return task().then(resolve, reject)
      })
      process.nextTick(this.next.bind(this))
    })
  }

  /** trigger the execution of a set of tasks until we reach the concurrency limit */
  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      /* The core change in the next() method is where we invoke task(). 
      In fact, now we expect that task() returns a Promise, so all we have to do is invoke finally() on that Promise
      so we can reset the count of running tasks if it either fulfills or rejects  */
      task().finally(() => {
        this.running--
        this.next()
      })
      this.running++
    }
  }
}
