import { EventEmitter } from 'events'
import { readFile } from 'fs'

/*
 (3.3) The Observer pattern defines an object (called subject) that can notify a set of observers (or listeners) when a change in its state occurs. 
 The main difference from the Callback pattern is that the subject can actually notify multiple observers, 
 while a traditional CPS callback will usually propagate its result to only one listener, the callback.

 
 The essential methods of the EventEmitter are as follows: 

on(event, listener): This method allows us to register a new listener (a function) for the given event type (a string). 

once(event, listener): This method registers a new listener, which is then removed after the event is emitted for the first time. 

emit(event, [arg1], [...]): This method produces a new event and provides additional arguments to be passed to the listeners. 

removeListener(event, listener): This method removes a listener for the specified event type.

*/

function findRegex (files, regex) {
  const emitter = new EventEmitter()
  for (const file of files) {
    readFile(file, 'utf8', (err, content) => {
      if (err) {
        return emitter.emit('error', err)
      }

      emitter.emit('fileread', file)
      const match = content.match(regex)
      if (match) {
        match.forEach(elem => emitter.emit('found', file, elem))
      }
    })
  }
  return emitter
}

findRegex(
  ['fileA.txt', 'fileB.json'],
  /hello \w+/g
)
  .on('fileread', file => console.log(`${file} was read`))
  .on('found', (file, match) => console.log(`Matched "${match}" in ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`))

// The EventEmitter treats the error event in a special way. 
// It will automatically throw an exception and exit from the application if such an event is emitted and no associated listener is found. 
// For this reason, it is recommended to always register a listener for the error event.



