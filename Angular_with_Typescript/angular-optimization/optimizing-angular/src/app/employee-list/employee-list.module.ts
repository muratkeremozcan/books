import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { EmployeeListComponent } from './employee-list.component';
import { NameInputComponent } from './name-input/name-input.component';
import { ListComponent } from './list/list.component';
import { CalculatePipe } from './calculate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatCommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  exports: [
    EmployeeListComponent
  ],
  declarations: [EmployeeListComponent, NameInputComponent, ListComponent, CalculatePipe]
})
export class EmployeeListModule {}
