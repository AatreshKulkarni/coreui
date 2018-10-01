import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent, ErrorDetailsComponent } from './errors.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorsComponent,
    data: {
      title: 'Error'
    }
  },
  {
    path: '',
    component: ErrorDetailsComponent,
    data: {
      title: 'ErrorDetail'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule {}
