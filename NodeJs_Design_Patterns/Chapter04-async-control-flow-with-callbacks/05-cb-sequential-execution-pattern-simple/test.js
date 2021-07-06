const tasks = [
  (cb) => {
    console.log('Task 1')
    setTimeout(cb, 1000)
  },
  (cb) => {
    console.log('Task 2')
    setTimeout(cb, 1000)
  },
  (cb) => {
    console.log('Task 3')
    setTimeout(cb, 1000)
  }
]

/** (4.2) pattern: iterate over a collection while applying an asynchronous operation */
function iterate (index) {
  if (index === tasks.length) {
    return finish()
  }
  const task = tasks[index]
  task(() => iterate(index + 1))
}

function finish () {
  // iteration completed
  console.log('All tasks executed')
}

iterate(0)


/*
The pattern that was just presented is very powerful and can be extended or adapted to address several common needs. 
Just to mention some examples:

We can map the values of an array asynchronously. 

We can pass the results of an operation to the next one in the iteration to implement an asynchronous version of the reduce algorithm. 

We can quit the loop prematurely if a particular condition is met (asynchronous implementation of the Array.some() helper).

We can even iterate over an infinite number of elements.
*/