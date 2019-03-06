import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';


import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { StorageServiceModule  } from 'angular-webstorage-service';

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './components/login/login.component';


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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { HomeModule } from './components/home/home.module';
import { HwcModule } from './components/hwc/hwc.module';
import { ErrorsModule } from './components/errors/errors.module';
import { CompesationModule } from './components/compensation/compensation.module';
import { DailyCountModule } from './components/daily-count/dailyCount.module';
import { PublicityModule } from './components/publicity/publicity.module';
import { ConnectorService } from './services/connector.service';
import { ExcelService } from './services/excel.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from './services/user.service';
import { MyDatePickerModule } from 'mydatepicker';
// import { AddHttpHeaderInterceptor } from './services/setAuthHeader.service';


import { UsersModule } from './components/users/users.module';
import { AddUserService } from './services/addUser.service';

import { MaterialModule } from './material.module';
import { DBDownloadModule } from './components/dbdownload/dbdownload.module';
import { MapsModule } from './components/maps/maps.module';
import { AuthGuard } from './guard/auth.guard';




@NgModule({
  imports: [
BrowserModule,
  CommonModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    ChartsModule,
    HwcModule,
    CompesationModule,
    DailyCountModule,
    PublicityModule,
    MapsModule,
    UsersModule,
    DBDownloadModule,
    MaterialModule,
   ErrorsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StorageServiceModule ,
    ReactiveFormsModule,
    FormsModule,
   HomeModule,
   MyDatePickerModule
  ],
  schemas: [NO_ERRORS_SCHEMA ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    LoginComponent,

],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  },
  ConnectorService,
  ExcelService,
  UserService,
  AddUserService,
  AuthGuard

],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
