
function makeSampleTask (name) {
  return (cb) => {
    console.log(`${name} started`)
    setTimeout(() => {
      console.log(`${name} completed`)
      cb()
    }, Math.random() * 2000)
  }
}

const tasks = [
  makeSampleTask('Task 1'),
  makeSampleTask('Task 2'),
  makeSampleTask('Task 3'),
  makeSampleTask('Task 4')
]

let completed = 0

/* The Unlimited Parallel Execution pattern 

Run a set of asynchronous tasks in parallel by launching them all at once, 
and then wait for all of them to complete by counting the number of times their callbacks are invoked. 
*/
tasks.forEach(task => {
  task(() => {
    if (++completed === tasks.length) {
      finish()
    }
  })
})

function finish () {
  // all the tasks completed
  console.log('All tasks executed!')
}
