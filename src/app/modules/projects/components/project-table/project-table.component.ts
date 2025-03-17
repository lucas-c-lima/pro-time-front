import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ActivityEvent } from 'src/app/models/enums/activities/ActivityEvent';
import { ProjectEvent } from 'src/app/models/enums/projects/ProjectEvent';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss']
})
export class ProjectTableComponent {
  private readonly destroy$: Subject<void> = new Subject();


  @Input() projects: Array<GetAllProjectsResponse> = [];
  @Output() projectSelected = new EventEmitter<GetAllProjectsResponse>();
  @Output() projectEvent = new EventEmitter<EventAction>();

  userIdValue :string = this.cookie.get('USER_PROFILE');
  userId :string = this.cookie.get('USER_ID');
  private adminRoute = ''

  public projectSelect!: GetAllProjectsResponse;
  public addProjectEvent = ProjectEvent.ADD_PROJECT_EVENT
  public editProjectEvent = ProjectEvent.EDIT_PROJECT_EVENT
  public selectProjectEvent = ProjectEvent.SELECT_PROJECT_EVENT

  public addProjectForm = false;

  private ref!: DynamicDialogRef;
  project!: GetAllProjectsResponse;
  public activitiesDatas: Array<GetAllActivitiesResponse> = [];
  public activitySelected!: GetAllActivitiesResponse;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private activitiesService: ActivitiesService,
    private dialogService: DialogService,
    private cookie: CookieService,
    private routeAdm: Router
  ){
  this.adminRoute = routeAdm.url;

  routeAdm.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.adminRoute = event.url;
    }
  });
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectDetails(Number(projectId));
      this.loadProjectActivities(Number(projectId))
    }
  }

  loadProjectDetails(id: number): void {
    this.projectsService.getProjectById(id).subscribe((project) => {
      this.project = project;
    });
  }

  loadProjectActivities(id: number): void {
   this.activitiesService.getActivitiesByProject(id).subscribe((activitiesDatas) => {
    this.activitiesDatas = activitiesDatas
   })
  }

  handleNewProject(): void {
      this.ref = this.dialogService.open(ProjectFormComponent,{
        header: "Adicionar projeto",
        contentStyle: { overflow: 'auto'},
        baseZIndex: 10000,
        data: {
          activitiesDatas: this.activitiesDatas,
        }
      });
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if(this.userIdValue === 'ADMIN' && this.adminRoute == '/admin/projects'){
            this.projectsService.getAllProjects().subscribe((projects) => {
              this.projects = projects;
            });
          } else {
            this.projectsService.getProjectsByUser(Number(this.userId)).subscribe((projects) => {
              this.projects = projects;
            });
          }
        },
      })
  }

  onProjectClick(project: GetAllProjectsResponse): void {
      this.projectSelected.emit(project);
  }

  formatStatus(status: string): string{
    return status.replace(/_/g, ' ').toLowerCase();
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'ALTA':
        return 'priority high-priority';
      case 'MEDIA':
        return 'priority medium-priority';
      case 'BAIXA':
        return 'priority low-priority';
      default:
        return 'priority';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLANEJADO':
        return 'status status-aberta';
      case 'EM_ANDAMENTO':
        return 'status status-em-andamento';
      case 'CONCLUIDO':
        return 'status status-concluida';
      case 'CANCELADO':
        return 'status status-pausada';
      default:
        return 'status';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
