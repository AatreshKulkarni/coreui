import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersComponent, UserUpdateComponent } from './users.component';
import { UserCreateComponent } from './users.component';
import { MaterialModule } from './../../material.module';
import { UsersRoutingModule } from './users-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [

UsersRoutingModule,
MaterialModule,
FormsModule,
ReactiveFormsModule,
CommonModule
  ],
  declarations: [ UsersComponent, UserCreateComponent, UserUpdateComponent ]
})
export class UsersModule { }
