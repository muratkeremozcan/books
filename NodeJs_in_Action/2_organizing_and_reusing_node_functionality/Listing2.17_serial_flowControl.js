'use strict';
const fs = require('fs');
const request = require('request'); // request module is an HTTP client that can be used to fetch RSS data
const htmlparser = require('htmlparser'); // htmlparser module has functionality that will allow you to turn raw RSS data into JS data structures
const configFileName = './rss_feeds.txt'; // the fetched RSS feeds will end up here

// Node 10 documentation on FileSystem https://nodejs.org/api/fs.html
// task 1: making sure the file containing the list of RSS feed urls exists
function checkForRSSFile() {
  fs.exists(configFileName, (exists) => {
    if (!exists) {
      return next(new Error(`Missing RSS file: ${configFileName}`)); // return early if the file does not exist
    }
    next(null, configFileName);
  });
}

// task 2: read and parse the file containing the feed URLs
function readRSSFile(configFileName) {
  fs.readFile(configFileName, (err, feedList) => {
    if (err) return next(err); // return early if error
    feedList = feedList // convert the list of URLs in txt file to a string then into an array of feed URLs
      .toString()
      .replace(/^\s+|\s+$/g, '') // regex: replace any white space in the beginning or end with no space
      .split('\n');
    const random = Math.floor(Math.random() * feedList.length);
    next(null, feedList[random]);
  });
}

// task 3: do a HTTP request and get data for the selected RSS feed
function downloadRSSFeed(feedUrl) {
  request({uri: feedUrl}, (err, res, body) => {
    if (err) return next(err);
    if (res.statusCode !== 200) return next(new Error('Abnormal response status code'));
    next(null, body);
  });
}

// task 4: parse RSS data into an array of items
function parseRSSFeed(rss) {
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length)
    return next(new Error('No RSS items found'));
  const item = handler.dom.items.shift();
  console.log(item.title); // display the title and url of the first feed item if it exists
  console.log(item.link);
}

// IMPORTANT: the key in serial flow control is to put the tasks in an array
// then shift the task from the array while calling the NEXT() function
const tasks = [  // add each task to be performed into an array in execution order
  checkForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parseRSSFeed
];

// a function to execute each task
function next(err, result) {
  if (err) throw err; // throw exception if task encounters an error
  const currentTask = tasks.shift(); // next task comes from an array of tasks . array.shift() shifts the array left, 'pops' the left most item
  if (currentTask) {
    currentTask(result);
  }
}

next(); // start SERIAL execution of tasks