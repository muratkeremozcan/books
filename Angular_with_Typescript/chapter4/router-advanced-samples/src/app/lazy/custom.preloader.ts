import { PreloadingStrategy, Route } from '@angular/router';

import { Observable, EMPTY } from 'rxjs';
import {Injectable} from "@angular/core";

@Injectable()
// create a class implementing the PreloadingStrategy
export class CustomPreloadingStrategy implements PreloadingStrategy {

  // passes the preload() method a callback function that returns an observable
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // checks the value of the preloadme property on the data object for each route configuration
    // if it exists and its value preloadme is true, then ivoke load callback
    return (route.data && route.data['preloadme']) ?
      load(): EMPTY;
  }
}
