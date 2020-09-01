import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {INCREMENT, DECREMENT} from './reducer';


// [3] setup the component to get the state and effect the state
@Component({
    selector: 'app-root',
    template: `
        <button (click)="increment()">Increment</button>
        <button (click)="decrement()">Decrement</button>
        <p>The counter: {{counter$ | async}}</p>
        <app-child></app-child>
    `
})
export class AppComponent {
    // (3.1) at the component, have a dummy observable to display the state
    counter$: Observable<number>;

    // (3.2) inject the store to the constructor and use store.select('stateName') for the component to get the state
    // note: stateName was defined in [2] app.module.ts
    constructor(private store: Store<any>) {
        this.counter$ = store.select('counterState');
    }

    // (3.3) set the state with functions that perform store.dispatch({type: actionsDefinedIn[1]})
    increment() {
        this.store.dispatch({type: INCREMENT});
    }

    decrement(){
        this.store.dispatch({type: DECREMENT});
    }
}
