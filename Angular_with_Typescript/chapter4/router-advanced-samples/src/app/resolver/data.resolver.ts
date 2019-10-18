import {Resolve} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class DataResolver implements Resolve<string[]>{
    // injects the HttpClient service to read the data
    constructor ( private httpClient: HttpClient){}
    // implements resolve method
    resolve(): Observable<string[]>{

        console.log("In Resolver");
      // reads the data from the file
      return this.httpClient.get<string[]>("./assets/48MB_DATA.json");
    }
}
