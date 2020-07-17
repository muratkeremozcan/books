import { PreloadingStrategy, Route } from '@angular/router';

import { Observable, EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';

// (3) implement preloading strategy
// Create a class implementing the PreloadingStrategy interface
@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  // Passes to the preload() method a callback function that returns an Observable
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Checks the value of the preloadme property on the data object for each route configuration.
    // If it exists and its value is preloadme: true, then invokes the load() callback.
    return (route.data && route.data.preloadme) ? load() : EMPTY; // returns empty observable if no preload
  }
}

// default preload all
// @Injectable()
// export class PreloadAllModules implements PreloadingStrategy {
//   preload(route: Route, fn: () => Observable<any>): Observable<any> {
//     return fn();
//   }
// }
