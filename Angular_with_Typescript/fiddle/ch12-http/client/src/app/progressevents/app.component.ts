import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';

// [5] Progress events (independent of previous sections building up knowledge up to [4]): HttpClient offers progress events that can keep the user informed
// high level:
// enable the progress event (5.1)
// in the subscribe method check the event .type (Upload/DownloadEvent) and use their properties: .loaded & .total (5.2)

@Component({
  selector: 'app-root',
  template: `<h1>Reading a file: {{percentDone}}% done</h1>
  `})
export class AppComponent {

  mydata: any;
  percentDone: number;

  constructor(private httpClient: HttpClient) {

    // (5.1) enable the progress event tracking; make the requests using the HttpRequest object with the option {reportProgress: true}
    const req = new HttpRequest(
      'GET',
      './data/48MB_DATA.json', { reportProgress: true } // KEY
    );

    // (5.2) in the subscribe method check the event type with .type property (HttpEventType.DownloadProgress, UploadProgress), and use their properties .loaded & .total
    httpClient.request(req).subscribe(data => {
      if (data.type === HttpEventType.DownloadProgress) { // checking the type of the progress event
        this.percentDone = Math.round(100 * data.loaded / data.total); // using .loaded .total properties
        console.log(`Read ${this.percentDone}% of ${data.total} bytes`);
      } else { // if the emitted value is not a progress event, just relay it (not being used in the template but this is best practice)
        this.mydata = data
      }
    });
  }
}

// to run :   ng serve progressevents -o