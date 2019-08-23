import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DbdownloadComponent, DBDetailsComponent } from './dbdownload.component';

const routes: Routes = [
  {
    path: '',
    component: DbdownloadComponent,
    data: {
      title: 'DBDownload'
    }
  },
  {
    path: '',
    component: DBDetailsComponent,
    data: {
      title: 'DBDetail'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DBDownloadRoutingModule {}
