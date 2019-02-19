import { NgModule } from '@angular/core';

import { MapsComponent } from './maps.component';
import { MapsRoutingModule } from './maps-routing.module';
import { MaterialModule } from './../../material.module';
  import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

  import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { TabsModule } from 'ngx-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
@NgModule({
  imports: [
    MapsRoutingModule,
    MaterialModule,
  Ng4LoadingSpinnerModule.forRoot(),
  FormsModule,
  CommonModule,
  TabsModule,
  MyDatePickerModule,
  NgxPaginationModule
  ],
  declarations: [ MapsComponent ]
})
export class MapsModule { }
