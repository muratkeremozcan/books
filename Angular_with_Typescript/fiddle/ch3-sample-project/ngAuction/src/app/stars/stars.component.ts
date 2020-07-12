import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nga-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  // Decorates the properties count and rating with @Input
  // so that the parent component (product-item-component)
  // can assign its value using property binding
  @Input() count = 5; // number of stars to rendered (could be just hard-coded)
  @Input() rating = 0; // come from product-item-component
  stars: boolean[] = []; // true: filled, false: empty

  constructor() { }

  ngOnInit() {
    // Initializes the stars array with Boolean values
    // based on the rating provided by the parent component
    for (let i = 0; i < this.count; i++) {
      this.stars.push(i > this.rating); // push true or false
    }
  }

}
