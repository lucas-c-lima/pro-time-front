import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardHomeComponent } from './modules/dashboard/page/dashboard-home/dashboard-home.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
{
  path: '',
  redirectTo: 'dashboard',
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
{
  path: 'projects',
  loadChildren: () => import('./modules/projects/projects.module').then(
    (m) => m.ProjectsModule
  ),
  canActivate: [AuthGuard],
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
