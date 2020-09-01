import {Injectable} from "@angular/core";
import {LoggingService} from "./logging.service";


// (4.5) because LoggingService class is abstract, it can’t be instantiated, we need to create the class ConsoleLoggingService

@Injectable()
export class ConsoleLoggingService implements LoggingService{

   log(message:string): void {
        console.log(message);
   }
}
