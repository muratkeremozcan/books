import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ListGenerator, EmployeeData } from './shared/list-generator.service';
import { Rnd } from './data/rnd-70-27-30';
import { Sales } from './data/sales-70-27-30';

// (1.1) use immutable.js for mutating data structures
// we get a new reference when mutating a given data structure. The initial list is unchanged.
// we do not copy the entire data structure; internally immutable.js re-uses everything it can from the original list
import { List } from 'immutable';

const NumRange: [number, number] = [23, 28];

@Component({
  selector: 'sd-app',
  // (1.3) add onPush changeDetectionStrategy
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sd-employee-list
      [data]="salesList"
      department="Sales"
      (add)="salesList = add(salesList, $event)"
      (remove)="salesList = remove(salesList, $event)"
    ></sd-employee-list>

    <sd-employee-list
      [data]="rndList"
      department="R&D"
      (add)="rndList = add(rndList, $event)"
      (remove)="rndList = remove(rndList, $event)"
    ></sd-employee-list>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  salesList: List<EmployeeData>;
  rndList: List<EmployeeData>;
  label: string = '';

  constructor(private generator: ListGenerator) {}

  ngOnInit() {
    this.salesList = List(Sales);
    this.rndList = List(Rnd);
  }

  // (1.2) when "mutating" the list, we get a new reference. Therefore we can return and assign the value over to salesList and rndList
  add(list: List<EmployeeData>, name: string) {
    return list.unshift({ label: name, num: this.generator.generateNumber(NumRange) });
  }

  remove(list: List<EmployeeData>, node: EmployeeData) {
    return list.splice(list.indexOf(node), 1);
  }
}
