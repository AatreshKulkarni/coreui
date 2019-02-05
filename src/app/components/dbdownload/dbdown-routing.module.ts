import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DbdownloadComponent } from './dbdownload.component';

const routes: Routes = [
  {
    path: '',
    component: DbdownloadComponent,
    data: {
      title: 'Daily Count'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DBDownloadRoutingModule {}
