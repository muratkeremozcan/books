/**
 *  RxJS in Action
 *  Listing 2.4
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const progressBar$ = Rx.Observable.create(observer => { // observable is created
   const OFFSET = 3000; // starts after 3 seconds
   const SPEED =  50; // emits a new progress value every 50 ms

   let val = 0;
   function progress() {
     if(++val <= 100) {
       observer.next(val);
       setTimeout(progress, SPEED); // call the progress function recursively
     }
     else {
       observer.complete(); // if an observable is finite, you can signal its completion with complete()
     }
   }
   // start the whole thing after 3 seconds
   setTimeout(progress, OFFSET);
});

// The details of how the values are generated and emitted belongs in the observable,
// whereas all the details of rendering, whether you want a simple number indicator or use some third-party progress bar widget,
// are for the caller to implement within the observer.

//--------------------------------------------------//
//                Usage                             //
//--------------------------------------------------//
window.onload = function() {
  const label = document.querySelector('#progress-indicator');
  progressBar$
    .subscribe( // observer subscribes to the observable
      val => label.textContent = (Number.isInteger(val) ? val + "%" : val),
      error => console.log(error.message),
      () => label.textContent = 'Complete!'
    );
};
