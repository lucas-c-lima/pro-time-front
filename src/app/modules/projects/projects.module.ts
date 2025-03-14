import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module'
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule} from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectsHomeComponent } from './projects-home/projects-home.component';
import { RouterModule } from '@angular/router';
import { PROJECTS_ROUTES } from './projects.routing';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectTableComponent } from './components/project-table/project-table.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    ProjectsHomeComponent,
    ProjectDetailsComponent,
    ProjectTableComponent,
    ProjectFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(PROJECTS_ROUTES),
    SharedModule,
    HttpClientModule,
    // PrimeNg
    CardModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    DropdownModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    TooltipModule,
    DatePipe,
    CalendarModule,
    ToastModule
],
  providers: [DialogService, ConfirmationService, MessageService, DatePipe]
})
export class ProjectsModule { }
