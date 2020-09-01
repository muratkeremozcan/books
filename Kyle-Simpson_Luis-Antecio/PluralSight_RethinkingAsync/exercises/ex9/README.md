# Instructions

1. In this exercise, we're going to practice with CSP channel concurrency using asynquence.

2. Monitor the stream of click events from the button and publish them to a channel if the channel is ready for a message. Hint: `ASQ.csp.putAsync(..)`, which returns a promise

3. Set up go-routine that samples the channel from (2) once per second. In other words, if you click the button multiple times in a second, you only get one channel message. Hint: `ASQ.csp.take( ASQ.csp.timeout(..) )`

4. The sampled channel go-routine should add a "clicked!" message to the list.
