import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { MaterialModule } from './../../material.module';
  import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { CaseUsersComponent } from './caseUsers.component';
import { CaseUsersRoutingModule } from './caseUsers-routing.module';

@NgModule({
  imports: [
    CaseUsersRoutingModule,
    MaterialModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ CaseUsersComponent ]
})
export class CaseUsersModule { }
