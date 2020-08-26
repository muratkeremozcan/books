import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoggingInterceptor } from './logging.interceptor.service';
import { LoggingService } from './logging.service';
import { ConsoleLoggingService } from './console.logging.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, FormsModule
  ],
  // (4.3) an interceptor is an injectable service, so declare its provider for the HTTP_INTERCEPTORS token in the @NgModule() decorator
  // note: the multi: true option tells you that HTTP_INTERCEPTORS is a multiprovider token; allows to register more than 1 HTTP_INTERCEPTOR
  providers: [
    // (4.4) how to use an abstract class or HTTP_INTERCEPTORS:  provide: abstract class, useClass: the real/implemented class
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: LoggingService, useClass: ConsoleLoggingService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
