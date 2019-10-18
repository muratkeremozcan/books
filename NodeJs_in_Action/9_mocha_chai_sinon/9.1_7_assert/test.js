const assert = require('assert');
const Todo = require('./todo');
const todo = new Todo();
let testsCompleted = 0;

// 9.3 test that no delete items remain after deletion
function deleteTest() {
  todo.add('Delete Me');
  assert.equal(todo.length, 1, '1 item should exist');
  todo.deleteAll();
  assert.equal(todo.length, 0, 'No items should exist'); // ===
  assert.strictEqual(todo.length, 0, 'No items should exist'); // ===
  assert.deepEqual(todo.length, 0, 'No items should exist'); // comparing object>properties>> recursively going deep
  testsCompleted++;
}
function addTest() {
  todo.deleteAll();
  todo.add('Added');
  assert.notEqual(todo.length, 0, '1 item should exist'); // !==
  assert.notStrictEqual(todo.length, 0, '1 item should exist'); // !==
  assert.notDeepEqual(todo.length, 0, '1 item should exist'); // comparing object>properties>> recursively going deep
  testsCompleted++;
}

// this doesn't really work. Just note assert.ok for asserting value=true
function doAsyncTest(cb) {
  todo.doAsync(value => { // callback fires in 2 seconds
    assert.ok(value,'Callback should be passed true'); // the ok assertion is an easy way to test if the value is true
    testsCompleted++;
  });
  cb(); // trigger callback when done
}

// testing throw Error
function throwsTest(cb) {
  assert.throws(todo.add); // add called without an argument
  testsCompleted++;
}

deleteTest();
addTest();
throwsTest();
doAsyncTest(() => {
  console.log(`Completed ${testsCompleted} tests`);
});
