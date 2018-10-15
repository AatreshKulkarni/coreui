import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaseUsersComponent } from './caseUsers.component';

const routes: Routes = [
  {
    path: '',
    component: CaseUsersComponent,
    data: {
      title: 'Case-Users'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseUsersRoutingModule {}
