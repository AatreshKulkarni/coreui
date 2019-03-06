import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guard/auth.guard';


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
        loadChildren: './components/hwc/hwc.module#HwcModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'compensation',
        loadChildren: './components/compensation/compensation.module#CompesationModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'dailyCount',
        loadChildren: './components/daily-count/dailyCount.module#DailyCountModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'publicity',
        loadChildren: './components/publicity/publicity.module#PublicityModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        loadChildren: './components/reports/reports.module#ReportsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'wsidDatabase',
        loadChildren: './components/case-users/caseUsers.module#CaseUsersModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadChildren: './components/users/users.module#UsersModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'errors',
        loadChildren: './components/errors/errors.module#ErrorsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: './components/home/home.module#HomeModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'dbdownload',
        loadChildren: './components/dbdownload/dbdownload.module#DBDownloadModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'maps',
        loadChildren: './components/maps/maps.module#MapsModule',
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
exports: [ RouterModule ]
})
export class AppRoutingModule {}
