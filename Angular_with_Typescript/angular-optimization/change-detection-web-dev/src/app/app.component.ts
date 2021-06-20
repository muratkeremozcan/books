import { ListGenerator, EmployeeData } from './tree-generator.service';
import { Component, OnInit } from '@angular/core';
import { Names } from './names';

const NumRange: [number, number] = [23, 28];

@Component({
  selector: 'app-root',
  template: `
    <app-employee-list
      [data]="salesList"
      department="Sales"
      (add)="add(salesList, $event)"
      (remove)="remove(salesList, $event)"
    ></app-employee-list>

    <app-employee-list
      [data]="rndList"
      department="R&D"
      (add)="add(rndList, $event)"
      (remove)="remove(rndList, $event)"
    ></app-employee-list>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  salesList: EmployeeData[];
  rndList: EmployeeData[];
  label: string;

  constructor(private generator: ListGenerator) {}

  ngOnInit() {
    this.salesList = this.generator.generate(Names, NumRange, 100);
    this.rndList = this.generator.generate(Names, NumRange, 100);
  }

  add(list: EmployeeData[], name: string) {
    list.unshift({ label: name, num: this.generator.generateNumber(NumRange) });
  }

  remove(list: EmployeeData[], node: EmployeeData) {
    list.splice(list.indexOf(node), 1);
  }
}
