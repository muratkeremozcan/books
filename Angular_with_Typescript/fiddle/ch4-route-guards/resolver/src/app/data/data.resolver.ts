import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';


// (2.1) implement the resolver. Similar to (1.1) canActivate/canDeactivate

// the resolver is essentially a service, so we decorate it as Injectable
// since it's a service, it also has to be added to providers[] in @NgModule (same as 1.1)
@Injectable()
export class DataResolver implements Resolve<string[]> {

  // data.service.ts has logic for caching, so we use it
  constructor(private dataService: DataService) {}

  // the Resolve interface requires a resolve() method to be implemented
  // and returns an Observable, a Promise, or any arbitrary object
  resolve(): Observable<string[]> {
    return this.dataService.loadData();
  }
}
