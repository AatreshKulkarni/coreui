import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
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

// import { AddHttpHeaderInterceptor } from './services/setAuthHeader.service';


import { UsersModule } from './components/users/users.module';
import { AddUserService } from './services/addUser.service';

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
    ChartsModule,
    HwcModule,
    CompesationModule,
    DailyCountModule,
    PublicityModule,
    UsersModule,
    ErrorsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StorageServiceModule ,
    ReactiveFormsModule,
    HomeModule
  ],
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
  AddUserService
],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
