import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardHomeComponent } from './modules/dashboard/dashboard-home/dashboard-home.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
},
{
  path: 'home',
  component: HomeComponent
},
{
  path: 'dashboard',
  loadChildren: () =>
    import('./modules/dashboard/dashboard.module').then(
    (m) => m.DashboardModule
  ),
  canActivate: [AuthGuard]
},

//-------------- ADMIN
{
  path: 'admin/activities',
  loadChildren: () =>
    import('./modules/activities/activities.module').then(
      (m) => m.ActivitiesModule
    ),
  canActivate: [AuthGuard]
},
{
  path: 'admin/users',
  loadChildren: () => import('./modules/users/users.module').then(
    (m) => m.UsersModule
  ),
  canActivate: [AuthGuard],
},
{
  path: 'admin/projects',
  loadChildren: () => import('./modules/projects/projects.module').then(
    (m) => m.ProjectsModule
  ),
  canActivate: [AuthGuard],
},
{
  path: 'admin/insights',
  loadChildren: () => import('./modules/insights/insights.module').then(
    (m) => m.InsightsModule
  ),
  canActivate: [AuthGuard],
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
