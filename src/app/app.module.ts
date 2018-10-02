import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';


import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { MatToolbarModule, MatTableModule, MatFormFieldModule, MatInputModule,
  MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatCardModule,
  MatPaginatorModule, MatSortModule, MatGridListModule, MatMenuModule, MatTabsModule,
  MatButtonToggleModule } from '@angular/material';
import { StorageServiceModule  } from 'angular-webstorage-service';


// import { MatToolbarModule, MatTableModule, MatFormFieldModule, MatInputModule,
//   MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatCardModule,
//   MatPaginatorModule, MatSortModule, MatGridListModule, MatMenuModule, MatTabsModule,
//   MatButtonToggleModule } from '@angular/material';

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { HomeModule } from './components/home/home.module';
import { HwcModule } from './components/hwc/hwc.module';
import { ErrorsModule } from './components/errors/errors.module';
// import { CompensationComponent } from './components/compensation/compensation.component';
// import { DailyCountComponent } from './components/daily-count/daily-count.component';
// import { PublicityComponent } from './components/publicity/publicity.component';
import { CompesationModule } from './components/compensation/compensation.module';
import { DailyCountModule } from './components/daily-count/dailyCount.module';
import { PublicityModule } from './components/publicity/publicity.module';
import { ConnectorService } from './services/connector.service';
import { ExcelService } from './services/excel.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from './services/user.service';

import { AddHttpHeaderInterceptor } from './services/setAuthHeader.service';


import { UsersModule } from './components/users/users.module';
import { AddUserService } from './services/addUser.service';

@NgModule({
  imports: [

  BrowserModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HwcModule,
    CompesationModule,
    DailyCountModule,
    PublicityModule,
    UsersModule,
    ErrorsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule, MatTableModule, MatFormFieldModule, MatInputModule,
  MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatCardModule,
  MatPaginatorModule, MatSortModule, MatGridListModule, MatMenuModule, MatTabsModule,
  MatButtonToggleModule,
  StorageServiceModule ,
  //   MatToolbarModule, MatTableModule, MatFormFieldModule, MatInputModule,
  // MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatCardModule,
  // MatPaginatorModule, MatSortModule, MatGridListModule, MatMenuModule, MatTabsModule,
  // MatButtonToggleModule,MyDatePickerModule
  ReactiveFormsModule,HomeModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
  //  CompensationComponent,
  //  DailyCountComponent,
  //  PublicityComponent,
  //  HwcComponent
],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  },
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: AddHttpHeaderInterceptor,
  //   multi: true,
  // },

  ConnectorService,
  ExcelService,
  UserService,
  AddUserService
],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
