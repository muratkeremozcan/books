'use strict';
const fs = require('fs');
const Watcher = require('./watcher');
const watchDir = './watch';
const processedDir = './done';
const watcher = new Watcher(watchDir, processedDir);

watcher.on('process', (file) => { // when a file is found, put it in the keep directory
  const watchFile = `${watchDir}/${file}`;
  const processedFile = `${processedDir}/${file.toLowerCase()}`;
  fs.rename(watchFile, processedFile, err => {
    if (err) throw err;
  });
});

watcher.start(); // start directory monitoring

