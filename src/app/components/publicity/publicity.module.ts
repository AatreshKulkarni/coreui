import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { PublicityComponent } from './publicity.component';
import { PublicityRoutingModule } from './publicity-routing.module';
import { MaterialModule } from './../../material.module';

  import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {NgxPaginationModule} from 'ngx-pagination';
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
  imports: [

PublicityRoutingModule,
MaterialModule,
FormsModule,
CommonModule,
DatePickerModule,
TabsModule,
NgxPaginationModule,
MyDatePickerModule,
Ng4LoadingSpinnerModule
  ],
  declarations: [ PublicityComponent ]
})
export class PublicityModule { }
