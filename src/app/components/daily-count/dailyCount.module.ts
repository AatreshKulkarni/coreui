import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DailyCountComponent } from './daily-count.component';
import { DCRoutingModule } from './dc-routing.module';
import { MatToolbarModule, MatTableModule, MatFormFieldModule, MatInputModule,
  MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatCardModule,
  MatPaginatorModule, MatSortModule, MatGridListModule, MatMenuModule, MatTabsModule,
  MatButtonToggleModule } from '@angular/material';
  import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

  import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';


@NgModule({
  imports: [
    DCRoutingModule,
    MatToolbarModule, MatTableModule, MatFormFieldModule, MatInputModule,
  MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatCardModule,
  MatPaginatorModule, MatSortModule, MatGridListModule, MatMenuModule, MatTabsModule,
  MatButtonToggleModule,
  Ng4LoadingSpinnerModule.forRoot(),
  FormsModule,
  CommonModule,
  DatePickerModule
  ],
  declarations: [ DailyCountComponent ]
})
export class DailyCountModule { }
