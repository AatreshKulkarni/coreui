import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MaterialModule } from './../../material.module';
  import { MyDatePickerModule } from 'mydatepicker';
  import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { CompensationComponent } from './compensation.component';
import { CompRoutingModule } from './comp-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';

@NgModule({
  imports: [
    CompRoutingModule,
    MaterialModule,
    MyDatePickerModule,
    FormsModule,
    CommonModule,
    DatePickerModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ CompensationComponent ]
})
export class CompesationModule { }
