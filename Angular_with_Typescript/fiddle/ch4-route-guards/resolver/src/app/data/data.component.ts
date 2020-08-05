import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  // (2.1.1) KEY: In the constructor of the DataComponent, you extract the data loaded by the resolver and store it in the variable.
  constructor(private route: ActivatedRoute) {
    // to resolve the route. you have to reference  the app-routing.module>path>resolve>PROPERTY (laodedJsonData)
    // Because you named the property of the resolve object loadedJsonData,
    // you’ll be able to access preloaded data in the DataComponent using the ActivatedRoute object
    const someJsonData = route.snapshot.data.loadedJsonData;

    console.log('Got the data', someJsonData);
  }
  ngOnInit() {
  }
}
