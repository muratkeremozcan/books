import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  mydata: any;

  // HttpClient service is needed to read the data, must also be imported at app.module.ts
  constructor(private http: HttpClient) { }

  loadData(): Observable<string[]> {
    console.log('In DataService.loadData()');

    // the data service is a singleton, so it’ll survive creations and destructions of the DataComponent
    // and cached data remains available. If it is available, just return it it.
    if (this.mydata) {
      return of(this.mydata);  // return the cached data
    } else {
      // httpClient uses rxjs, what we get is of type string array from mock json
      return this.http.get<string[]>('./assets/48MB_DATA.json')
        .pipe(
          tap(data => this.mydata = data) // store the data in the variable mydata
        );
    }
  }
}
