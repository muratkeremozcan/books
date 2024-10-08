import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { CrisisService } from './crisis.service';
import { Crisis } from './crisis';

/*
If you were using a real world API, there might be some delay before the data to display is returned from the server.
You don't want to display a blank component while waiting for the data.

To improve this behavior, you can pre-fetch data from the server using a resolver so it's ready the moment the route is activated.
This also allows you to handle errors before routing to the component.
*/

@Injectable({
  providedIn: 'root',
})
export class CrisisDetailResolverService implements Resolve<Crisis> {
  constructor(private cs: CrisisService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Crisis> | Observable<never> {
    const id = route.paramMap.get('id');

    /*
    mergeMap operator is best used when you wish to flatten an inner observable and want to manually control the number of inner subscriptions.
    When using switchMap and the source emits, only one final active inner subscription is allowed to complete.
    In contrast, mergeMap allows for multiple inner subscriptions to be active at a time.
    Because of this, one of the most common use-case for mergeMap is requests that should not be canceled, think writes rather than reads.
    Here we have the else route, which would be cancelled if we were using switchMap.
    We do not want that, but instead want to navigate to the parent route.
    */

    return this.cs.getCrisis(id).pipe(
      take(1),
      mergeMap(crisis => {
        if (crisis) {
          return of(crisis);
        } else { // id not found
          this.router.navigate(['/crisis-center']);
          return EMPTY;
        }
      })
    );
  }
}

