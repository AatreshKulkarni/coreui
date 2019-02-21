import { NgModule } from '@angular/core';
import { ChartsModule } from '@progress/kendo-angular-charts';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { MyDatePickerModule } from 'mydatepicker';
import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';
import {ChartTypesModule} from '../../shared/components/chart-types/chart-types.module';

import 'hammerjs';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../../material.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';




@NgModule({
  imports: [
    HomeRoutingModule,
    ChartsModule,
    FormsModule,
    AgmJsMarkerClustererModule,
    CommonModule,
    MyDatePickerModule,
    HttpClientModule,
    MaterialModule,
    TabsModule,
    TooltipModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDm70lDa9nBtdLFCkYGOCKTY6ghftpmyhU'
    }),
  DatePickerModule,
  ChartTypesModule,
  ],
  declarations: [ HomeComponent ]
})
export class HomeModule { }


// new Chart(document.getElementById("chartjs-0"),
// {"type":"line","data":{"labels":["January","February","March","April","May","June","July"],
// "datasets":[{"label":"My First Dataset",
// "data":[65,59,80,81,56,55,40],
// "fill":false,
// "borderColor":"rgb(75, 192, 192)",
// "lineTension":0.1}]},
// "options":{}});

