import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import {DatePickerComponent} from './date-picker.component';

@NgModule({
  imports: [
    CommonModule,FormsModule,MyDatePickerModule
  ],
  declarations: [DatePickerComponent],
  exports: [
    DatePickerComponent
    ]
})
export class DatePickerModule { }
