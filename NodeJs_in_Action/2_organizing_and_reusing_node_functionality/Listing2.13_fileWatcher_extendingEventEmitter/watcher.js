'use strict';
const fs = require('fs');
const events = require('events');

// to extend an event emitter, create a child/sub class and its constructor, then add its unique functionality
class Watcher extends events.EventEmitter { // extending event emitter with a class named Watcher
  constructor(watchDir, processDir) { // the sub class has a constructor
    super();
    this.watchDir = watchDir;
    this.processDir = processDir;
  }

  watch() { // cycle through the directory, process any files found
    fs.readdir(this.watchDir, (err, files) => {
      if (err) throw err;
      for (var index in files) {
        // EE.emit(eventName, args)
        this.emit('process', files[index]); // emit the event when a file is found
      }
    });
  }

  start() { // extending event emitter with start method
    fs.watchFile(this.watchDir, () => { // using Node's watchFile, when something happens in the watched directory
      this.watch(); // trigger the watch method, the watch method cycles through and emits a process event for each file found
    });
  }
}

module.exports = Watcher; // exporting the whole class as opposed to 1 function with exports.functionName

