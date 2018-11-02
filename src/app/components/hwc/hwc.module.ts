import { NgModule } from '@angular/core';

// import { MatToolbarModule, MatTableModule, MatFormFieldModule, MatInputModule,
//   MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatCardModule,
//   MatPaginatorModule, MatSortModule, MatGridListModule, MatMenuModule, MatTabsModule,
//   MatButtonToggleModule } from '@angular/material';
import { MaterialModule } from './../../material.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { HwcComponent } from './hwc.component';
import { HwcRoutingModule } from './hwc-routing.module';
import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';
import {ChartTypesModule} from '../../shared/components/chart-types/chart-types.module';


@NgModule({
  imports: [

  HwcRoutingModule,
  MaterialModule,
  DatePickerModule,
  ChartTypesModule,
  Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ HwcComponent ]
})
export class HwcModule { }
