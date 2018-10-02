import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartTypesComponent} from './chart-types.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ChartTypesComponent],
  exports:[
    ChartTypesComponent
  ]
})
export class ChartTypesModule { }
