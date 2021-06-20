import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { List } from 'immutable';
import { EmployeeData } from '../../shared/list-generator.service';

// (2) move your pure calculations to pure pipes
// This is a Pure function. Angular (pure) Pipes are inspired from pure functions.
// Angular can perform an optimization with pure pipes.
// It executes a pure pipe only when it detects a change to the input value.
// There for instead of this function, use a pipe to take advantage of the Angular optimization

// const fibonacci = (num: number): number => {
//   if (num === 1 || num === 2) {
//     return 1;
//   }
//   return fibonacci(num - 1) + fibonacci(num - 2);
// };

@Component({
  selector: 'sd-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  @Input() data: List<EmployeeData>;
  @Output() remove = new EventEmitter<EmployeeData>();

  // calculate(num: number) {
  //   return fibonacci(num);
  // }
}
