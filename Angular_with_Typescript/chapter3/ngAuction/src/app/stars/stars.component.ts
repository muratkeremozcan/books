import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nga-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {

  @Input() count = 5; // decorates the property 'count' with @Input so the parent component can assign its value using property binding
  @Input() rating = 0; // decorates the property 'rating' with @Input
  stars: boolean[] = [];

  ngOnInit() { // initialize the stars array with boolean values based on the rating provided by the parent component
    for (let i = 1; i <= this.count; i++) {
      this.stars.push(i > this.rating); // push true or false
    }
  }

}
