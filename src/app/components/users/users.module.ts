import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersComponent, UserUpdateComponent, MatConfirmDialogComponent } from './users.component';

import { UserCreateComponent } from './users.component';
import { MaterialModule } from './../../material.module';
import { UsersRoutingModule } from './users-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  imports: [

UsersRoutingModule,
MaterialModule,
FormsModule,
ReactiveFormsModule,
NgxPaginationModule,
CommonModule
  ],
  declarations: [ UsersComponent, UserCreateComponent, UserUpdateComponent, MatConfirmDialogComponent ],
  entryComponents: [MatConfirmDialogComponent]
})
export class UsersModule { }
