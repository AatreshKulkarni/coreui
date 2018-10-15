import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HwcComponent } from './hwc.component';

const routes: Routes = [
  {
    path: '',
    component: HwcComponent,
    data: {
      title: 'HWC'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HwcRoutingModule {}
