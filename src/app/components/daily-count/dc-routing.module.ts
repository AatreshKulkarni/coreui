import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyCountComponent } from './daily-count.component';

const routes: Routes = [
  {
    path: '',
    component: DailyCountComponent,
    data: {
      title: 'Daily Count'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DCRoutingModule {}
