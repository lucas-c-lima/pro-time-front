import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ROUTES } from './dashboard.routing';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardWelcomeComponent } from './components/dashboard-welcome/dashboard-welcome.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    DashboardHomeComponent,
    DashboardWelcomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    // PrimeNg
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    DropdownModule,
    TableModule,
    //Shared
    SharedModule
  ],
  providers: [MessageService, CookieService]
})
export class DashboardModule { }
