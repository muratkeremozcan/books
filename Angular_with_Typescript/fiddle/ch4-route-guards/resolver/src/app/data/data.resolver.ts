import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';


// (1) configure the resolver
// If you want to to not even render the component until the required data arrives,
// create a Resolve guard that allows to get the data
// (here you can insert some loading component for the sake of responsive feeling)
// then navigate to the route once the component is ready.

// the resolver is essentially a service, so we decorate it as Injectable
// since it's a service, it also has to be added to providers[] in app.module.ts
@Injectable()
export class DataResolver implements Resolve<string[]> {

  // data.service.ts has logic for caching, so we use it
  constructor(private dataService: DataService) {}

  // the Resolve interface requieres a resolve() method to be implemented
  // and return an Observable, a Promise, or any arbitrary object
  resolve(): Observable<string[]> {
    return this.dataService.loadData();
  }
}
