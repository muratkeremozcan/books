import {Injectable} from '@angular/core';

// (4.4) why use an abstract class for such a simple logging service?
// It’s because in real-world apps, you may want to introduce logging not only on the browser’s console, but also on the server.
// Having an abstract class would allow you to use it as a token for declaring a provider at @NgModule

// i.e. we have ConsoleLoggingService for the client, we could later implement a ServerLoggingService

@Injectable()
export abstract class LoggingService {

  abstract log(message: string): void;
}
