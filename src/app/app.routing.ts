import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,

    children: [
      {
        path: 'hwc',
        loadChildren: './components/hwc/hwc.module#HwcModule'
      },
      {
        path: 'compensation',
        loadChildren: './components/compensation/compensation.module#CompesationModule'
      },
      {
        path: 'dailyCount',
        loadChildren: './components/daily-count/dailyCount.module#DailyCountModule'
      },
      {
        path: 'publicity',
        loadChildren: './components/publicity/publicity.module#PublicityModule'
      },
      {
        path: 'reports',
        loadChildren: './components/reports/reports.module#ReportsModule'
      },
      {
        path: 'wsidDatabase',
        loadChildren: './components/case-users/caseUsers.module#CaseUsersModule'
      },
      {
        path: 'users',
        loadChildren: './components/users/users.module#UsersModule'
      },
      {
        path: 'errors',
        loadChildren: './components/errors/errors.module#ErrorsModule'
      },
      {
        path: 'dashboard',
        loadChildren: './components/home/home.module#HomeModule'
      },
      {
        path: 'dbdownload',
        loadChildren: './components/dbdownload/dbdownload.module#DBDownloadModule'
      },
      {
        path: 'maps',
        loadChildren: './components/maps/maps.module#MapsModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
