import { NgModule } from '@angular/core';

import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { MaterialModule } from './../../material.module';
  import { MyDatePickerModule } from 'mydatepicker';
  import{FormsModule} from '@angular/forms'
  import {CommonModule} from '@angular/common';
  import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
  import { TabsModule } from 'ngx-bootstrap/tabs';
@NgModule({
  imports: [

ReportsRoutingModule,
MaterialModule,
MyDatePickerModule,
CommonModule,
FormsModule,
TabsModule,
Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ ReportsComponent ]
})
export class ReportsModule { }
