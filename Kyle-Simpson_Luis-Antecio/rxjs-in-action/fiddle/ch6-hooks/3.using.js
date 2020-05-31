import Rx from 'rxjs/Rx';

// using() : combines logic tied to the start and end of an observable.
// The idea behind it is that you often have resources that are completely subject to the lifespan of the observable. 
// In order to hook into this stage, the only requirement is that the object you plug in must be disposable-like,
//  which is to say that it must declare an unsubscribe() method in order to be cleaned up properly

// using takes 2 arguments (factory functions): a function that creates a disposible resource, a function that creates an observable

// a disposible resource is needed; it needs to implement an unsubscribe() method
// the disposible resource is tied to the lifecycle of the observable created by this function, 
// so that when the latter is disposed of, so is the resource.

// note: disposible = unsubscribeable

class DisposibleResource {
  constructor(value) {
    this.value = value;
    this.disposed = false;
  }

  getValue() {
    if (this.disposed) {
      throw new Error('Object is disposed');
    }
    return this.value;
  }

  unsubscribe() { // a disposible resource must implement unsubscribe()
    if (!this.disposed) {
      this.disposed = true;
      this.value = null;
    }
    console.log('Disposed');
  }
}

// When an observer subscribes to the observable factory function of using(), 
// the disposible factory function is invoked to create an instance of the resource
// then the disposible factory function is passed to the observable factory function as a parameter


const source$ = Rx.Observable.using(
  () => new DisposibleResource(42), // the disposable factory function / the resource
  resource => Rx.Observable.interval(1000) // the observable factory function (the resource is passed as a parameter)
  )

const subscription = source$.subscribe(
  next => console.log(`next: ${next}`),
  err => console.log(`err: ${err}`),
  () => console.log('subscription completed') // just like in finally(), never gets called
);

// you unsubscribe from the source, which will unsubscribe from the observable managing the resource as well as the resource itself
subscription.unsubscribe();


// check out gulp example 6.2 for a user session example