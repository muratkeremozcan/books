# Instructions

1. In this exercise, we're going to practice with "reactive sequences" programming (aka "observables") using asynquence.

2. Set up a reactive sequence for the stream of click events from the button. Hint: `ASQ.react.of()` and `rsq.push(..)`

3. Set up another reactive sequence that samples the sequence stream from (2) once per second. In other words, if you click the button multiple times in a second, you only get one event message. Hint: `setInterval(..)`

4. The sampled sequence should add a "clicked!" message to the list.
