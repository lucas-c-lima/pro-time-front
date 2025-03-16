import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ProjectsDataTransferService } from 'src/app/shared/services/projects/projects-data-transfer.service';
import { ActivityFormComponent } from '../../activities/components/activity-form/activity-form.component';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { ProjectFormComponent } from '../components/project-form/project-form.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-projects-home',
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.scss']
})
export class ProjectsHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public projectsDatas: Array<GetAllProjectsResponse> = [];
  public selectedProject: GetAllProjectsResponse | null = null;

  private ref!: DynamicDialogRef;
  public activitiesDatas: Array<GetAllActivitiesResponse> = [];

  userIdValue :string = this.cookie.get('USER_PROFILE');
  userId :string = this.cookie.get('USER_ID');
  private adminRoute = ''

  constructor(
    private projectsService: ProjectsService,
    private projectsDtService: ProjectsDataTransferService,
    private activitiesService: ActivitiesService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private cookie: CookieService
  ){}

  ngOnInit(): void {
    this.getServiceProjectsDatas();
  }

  getServiceProjectsDatas() {
      this.getAPIProjectsDatas();
      this.getAPIActivitiesDatas()
  }

  getAPIProjectsDatas() {
    if(this.userIdValue === 'ADMIN' && this.adminRoute == '/admin/projects'){
      this.projectsService
      .getAllProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0){
            this.projectsDatas = response
          }
        },
        error: (err) => {
          console.log(err)
          this.messageService.add({
            severity:'Error',
            summary: 'Erro',
            detail: 'Erro ao acessar a Projetos',
            life: 2500,
          })
          this.router.navigate(['/dashboard'])
        }
      })
    } else {
      this.projectsService
      .getProjectsByUser(Number(this.userId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0){
            this.projectsDatas = response
          }
        },
        error: (err) => {
          console.log(err)
          this.messageService.add({
            severity: 'Error',
            summary: 'Erro',
            detail: 'Erro ao acessar a Projetos',
            life: 2500,
          })
          this.router.navigate(['/dashboard'])
        }
      })
    }
  }

  getAPIActivitiesDatas() {
    this.activitiesService
    .getAllActivities()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0){
          this.activitiesDatas = response
        }
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity: 'Error',
          summary: 'Erro',
          detail: 'Erro ao acessar a Atividades',
          life: 2500,
        })
        this.router.navigate(['/dashboard'])
      }
    })
  }

  handleProjectActivityAction(event: EventAction): void{
      if (event){
        this.ref = this.dialogService.open(ProjectFormComponent,{
          header: event?.action,
          width: '70%',
          contentStyle: { overflow: 'auto'},
          baseZIndex: 10000,
          data: {
            event: event,
            activitiesDatas: this.activitiesDatas,
          }
        });

        this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getAPIProjectsDatas()
            this.getAPIActivitiesDatas()
            this.toReload('reload');
          },
        })
      }
    }

  handleDeleteProject(event: {
    id: number,
    name: string
  }): void{
    this.confirmationService.confirm({
      message: `Deseja realmente cancelar o projeto: ${event?.name}`,
      header: "Cancelar projeto",
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteProject(event.id);
        this.backToProjects()
        this.getServiceProjectsDatas()
      }
    })
  }

  private deleteProject(projectId: number){
    if(projectId !== 0){
      this.projectsService.deleteProject(projectId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Projeto cancelado com sucesso',
            life: 2500
          });
        },error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar projeto',
            life: 2500
          });
        }
      })
    }
  }

  onProjectSelected(project: GetAllProjectsResponse){
    this.selectedProject = project
  }
  public reload: string = ''
  toReload(value: string): void{
    this.reload = value;
  }

  backToProjects(): void {
    this.selectedProject = null;
    this.getAPIProjectsDatas()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
