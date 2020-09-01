import * as Rx from 'rxjs/Rx';

// Under the hood, the test scheduler parses out the ASCII text, and from this it generates and queues the actions to perform, 
// which then get published as notifications. 

// createTime()
let scheduler = new Rx.TestScheduler();
// each frame counts as 10 ms           
let time = scheduler.createTime('----------|');
time; //?


////
// parseMarbles()
// the dashes represent frames and the letters events (or notifications) that the stream will publish. Every dash represents 10 frames.
let result = Rx.TestScheduler.parseMarbles('--a---b---|', { a: 'A', b: 'B' });

result; //?


// map example
/*
source  --1--2--3--4--5--6--7--8--9--| 
map     square => a * a 
subs    --1--4--9--16--25--36--49--64--81--|
*/


// gulp examle 9.9 - 9.12 are worth looking at for unit test
// https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing