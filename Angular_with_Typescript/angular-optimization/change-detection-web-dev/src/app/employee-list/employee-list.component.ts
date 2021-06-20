import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { EmployeeData } from './../tree-generator.service';

@Component({
  selector: 'app-employee-list',
  template: `
    <h1 title="Department">{{ department }}</h1>

    <mat-form-field>
      <input placeholder="Enter name here" matInput type="text" [(ngModel)]="label" (keydown)="handleKey($event)">
    </mat-form-field>

    <mat-list>
      <div *ngIf="data.length === 0" class="empty-list-label">Empty list</div>
      <mat-list-item *ngFor="let item of data">
        <h3 matLine title="Name">
          {{ item.label }}
        </h3>
        <mat-chip-list>
          <div class="chip">
            {{ item.num | calculate }}
          </div>
        </mat-chip-list>
        <i title="Delete" class="fa fa-trash-o" aria-hidden="true" (click)="remove.emit(item)"></i>
      </mat-list-item>
      <mat-divider *ngIf="data.length !== 0"></mat-divider>
    </mat-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['employee-list.component.css']
})
export class EmployeeListComponent {
  @Input() data: EmployeeData[];
  @Input() department: string;

  @Output() remove = new EventEmitter<EmployeeData>();
  @Output() add = new EventEmitter<string>();

  label: string;

  handleKey(event: any) {
    if (event.keyCode === 13) {
      this.add.emit(this.label);
      this.label = '';
    }
  }
}
