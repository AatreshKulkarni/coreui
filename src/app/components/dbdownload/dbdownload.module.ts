import { NgModule, NO_ERRORS_SCHEMA  } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DbdownloadComponent, DBDetailsComponent, ImageComponent } from './dbdownload.component';
import { DBDownloadRoutingModule } from './dbdown-routing.module';
import { MaterialModule } from './../../material.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { TabsModule } from 'ngx-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
@NgModule({
  imports: [
    DBDownloadRoutingModule,
    MaterialModule,
  Ng4LoadingSpinnerModule.forRoot(),
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  TabsModule,
  MyDatePickerModule,
  NgxPaginationModule,

  ],
   schemas: [NO_ERRORS_SCHEMA],
  declarations: [ DbdownloadComponent, DBDetailsComponent, ImageComponent ],
  entryComponents: [ImageComponent]
})
export class DBDownloadModule { }
