var assert = require('assert');
// by using yield* on another iterator (object, function or anything), we yield to another generator
function* WarriorGenerator() {
  yield "Sun Tzu";
  yield* NinjaGenerator(); // IMPORTANT: yield* delegates to another generator
  yield "Genghis Khan";
}
function* NinjaGenerator() {
  yield "Hattori";
  yield "Yoshi";
}
// The best way to iterate any iterable (an object which supports @@iterator), is to use for..of
for(let warrior of WarriorGenerator()) { // the for of loop does not care that WarriorGenerator yields to NinjaGenerator, it keeps calling next until it's done
  console.log(warrior);
}