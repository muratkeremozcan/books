import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoggingService } from "./logging.service";

// [4] (supercedes all: [1] http.get, [2] async pipe & error handling, [3] http.post)
// HTTP interceptor is the meta way of error handling or any other cross-cutting concern with the app
// In [3] we handled the error in the TS, here we use a service so that error handling is not duplicated among components
// this is how we implement a cross-cutting concern like a global error-logging service for all HTTP responses
// without the need to modify any application components or services that use the HttpClient service as in [3]

// HTTP interceptors allow  pre- and post-processing of all HTTP requests and responses
// useful for implementing cross-cutting concerns as logging, global error handling, authentication, and others.
// the interceptors work before the request goes out and/or before a response is rendered on the UI.
// This gives you a chance to implement the fallback scenarios for certain errors or prevent attempts of unauthorized access.

// high level:
// implement a service to be the HttpInterceptor (4.1) and implement the intercept method (4.2)
// declare the service in providers property of @NgModule (4.3)
// (extra:4.4 & 4.5 for abstract class:having an abstract class allows to use it as a token for declaring a provider, then it can be used anywhere)
// (4.6) at the template configure a $response variable that can store & display the result of the observable http request going out from the client

// (4.1) to create an interceptor, write a service that implements the HttpInterceptor interface with one method: intercept().
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor(private loggingService: LoggingService) {
  }
  // (4.2) implement the intercept method with 2 args:
  // HttpRequest : the request obj being intercepted
  // HttpHandler : used to forward the modified request to the backend or another interceptor in the chain (if any), and forwards the response to the client
  // by invoking the handle() method, which returns an observable once the request is complete
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req) // forwards the request (originating from the TS) to the server, and the response to the client
      .pipe(
        // KEY: all the purpose of the interceptor when handling the response from the server is accomplished by catchError operator in this example
        catchError((err: HttpErrorResponse) => {
          // logs to console
          this.loggingService.log(`Logging Interceptor: ${err.error.message}`);
          // replaces the HttpErrorResponse with a new instance of HttpResponse containing the error message
          // and returns it so that the browser can show it
          return of(new HttpResponse({
            body: {
              message: err.error.message // .message because we specified the server to return a 'message' property
            }
          }));
        })
      );

    /*
    note : the args are immutable. In FP fashion, they must be cloned if they are to be modified.
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const modifiedRequest = req.clone({ setHeaders: { ('Authorization', 'Basic QWxhZGRpb') }});
      return next.handle(modifiedRequest);
    } */
  }
}


// to run:
// UI (client folder):  ng serve interceptor -o --proxy-config proxy-conf.json
// API (server folder): node build/rest-server-angular-post-errors