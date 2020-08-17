import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seller-info',
  templateUrl: './seller-info.component.html',
  styleUrls: ['./seller-info.component.scss']
})
export class SellerInfoComponent implements OnInit {

  // new (2.4) Because SellerInfoComponent expects to receive the seller ID,
  // its constructor needs an argument of type ActivatedRoute to get the seller ID

  sellerID: string;

  constructor(route: ActivatedRoute) {
    // gets the value of the passed id (from product component) and assigns it to sellerID for rendering
    this.sellerID = route.snapshot.paramMap.get('idSeller');
  }
  ngOnInit() {
  }

}
