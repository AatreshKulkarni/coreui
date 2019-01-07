import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DailyCountComponent } from './daily-count.component';
import { DCRoutingModule } from './dc-routing.module';
import { MaterialModule } from './../../material.module';
  import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

  import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { TabsModule } from 'ngx-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
@NgModule({
  imports: [
    DCRoutingModule,
    MaterialModule,
  Ng4LoadingSpinnerModule.forRoot(),
  FormsModule,
  CommonModule,
  DatePickerModule,
  TabsModule,
  MyDatePickerModule,
  NgxPaginationModule
  ],
  declarations: [ DailyCountComponent ]
})
export class DailyCountModule { }
