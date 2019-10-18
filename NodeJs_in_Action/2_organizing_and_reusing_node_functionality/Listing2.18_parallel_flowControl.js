'use strict';
const fs = require('fs');
const tasks = [];
const wordCounts = {};
const filesDir = './text';
let completedTasks = 0;

function checkIfComplete() {
  completedTasks++;
  if (completedTasks === tasks.length) {
    for (let index in wordCounts) { // when all tasks have completed...
      console.log(`${index}: ${wordCounts[index]}`); // ...list each word used in the files and how many times it was used
    }
  }
}

function addWordCount(word) {
  wordCounts[word] = (wordCounts[word]) ? wordCounts[word] +1 : 1;
}

function countWordsInText(text) {
  const words = text  // count word occurances in text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort();
  words
    .filter(word => word)
    .forEach(word => addWordCount(word));
}

/** https://nodejs.org/api/fs.html
 * Reads the contents of a directory. The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'
 */
fs.readdir(filesDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const task = (file => { // async function to handle each file
      return() => {
        fs.readFile(file, (err, text) => { // asynchronously read the file and count the word usage in the file
          if(err) throw err;
          countWordsInText(text);
          checkIfComplete();
        });
      };
    })(`${filesDir}/${file}`); // IIFE value being passed in
    tasks.push(task); // push each task function to the tasks array
  });

  tasks.forEach(task => task()); // execute each task
});