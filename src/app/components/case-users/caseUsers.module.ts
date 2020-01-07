import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { MaterialModule } from './../../material.module';
  import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CaseUsersComponent, CaseUsersDetailsComponent } from './caseUsers.component';
import { CaseUsersRoutingModule } from './caseUsers-routing.module';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    CaseUsersRoutingModule,
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TabsModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ CaseUsersComponent, CaseUsersDetailsComponent ],
  entryComponents: [CaseUsersDetailsComponent]
})
export class CaseUsersModule { }
