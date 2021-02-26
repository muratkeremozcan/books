import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { MessageService } from '../message.service';
import { Crisis } from './crisis';
import { CRISES } from './mock-crises';

@Injectable({
  providedIn: 'root',
})
export class CrisisService {
  static nextCrisisId = 100;
  private crises$: BehaviorSubject<Crisis[]> = new BehaviorSubject<Crisis[]>(CRISES);

  constructor(private messageService: MessageService) { }

  getCrises() { return this.crises$; }

  getCrisis(id: number | string) {
    return this.getCrises().pipe(
      // (+) before `id` turns the string into a number
      map(crises => crises.find(crisis => crisis.id === +id))
    );
  }

}


/*
Subject is just an Observable with the ability to call next() on itself, and is multicast / hot by default. It's a practical event emitter

the following operations exist on subject :

next([value])  // next, error and complete usually just callbacks in the  Observable.create() function
error([error message]) // but a subject can use them any time (freedom to emit)
complete()
subscribe()  // these are usually for the Observer, and subject can call them as well
unsubscribe()

BehaviorSubject: contrast to simple subject an initial value is sent, no calling next() necessary with it
Also, new subscribers will get the most recent value right before their subscription
*/
