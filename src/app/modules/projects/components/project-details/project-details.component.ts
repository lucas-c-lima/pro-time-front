import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ActivityEvent } from 'src/app/models/enums/activities/ActivityEvent';
import { ProjectEvent } from 'src/app/models/enums/projects/ProjectEvent';
import { ProjectPriority } from 'src/app/models/enums/projects/ProjectPriority';
import { ProjectStatus } from 'src/app/models/enums/projects/ProjectStatus';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { EditEntryRequest } from 'src/app/models/interface/hours/request/EditEntryRequest';
import { DeleteProjectAction } from 'src/app/models/interface/projects/event/DeleteProjectAction';
import { EditProjectRequest } from 'src/app/models/interface/projects/request/EditProjectRequest';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy, OnChanges{
  private readonly destroy$: Subject<void> = new Subject();

  userIdValue :string = this.cookie.get('USER_PROFILE');
  @Input() project!: GetAllProjectsResponse;
  @Input() reload: string = '';
  @Output() backToProjectsEvent = new EventEmitter<void>();
  @Output() activityEvent = new EventEmitter<EventAction>();
  @Output() newProjectEvent = new EventEmitter<EventAction>();
  @Output() deleteProjectEvent = new EventEmitter<DeleteProjectAction>()


  public addActivityEvent = ActivityEvent.ADD_ACTIVITY_EVENT;
  public editActivityEvent = ActivityEvent.EDIT_ACTIVITY_EVENT;
  public hoursActivityAction = ActivityEvent.HOURS_ACTIVITY_EVENT;

  activities: GetAllActivitiesResponse[] = [];
  activitySelected!: GetAllActivitiesResponse;
  usersDatas: Array<GetAllUsersResponse> = []
  public projectPriorityOptions = Object.keys(ProjectPriority).map(key => ({
    id: key,
    name: ProjectPriority[key as keyof typeof ProjectPriority]
  }))
  public projectStatusOptions = Object.keys(ProjectStatus).map(key => ({
    id: key,
    name: ProjectStatus[key as keyof typeof ProjectStatus]
  }))
  public selectedUsers: Array<{name: string; code: string}> = []


  editingProject: any = null;

  constructor(
    private activitiesService: ActivitiesService,
    private usersService: UserService,
    private datePipe: DatePipe,
    private projectService: ProjectsService,
    private messageService: MessageService,
    private cookie: CookieService
) {}

  ngOnInit(): void {
    this.loadActivities();
    this.getAllUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reload']) {
      if(this.reload === 'reload'){
        this.activitiesService.getActivitiesByProject(this.project.id).subscribe((activities) => {
          this.activities = activities;
        });
      }
    }
  }

  public loadActivities() {
    if (this.project && this.project.id) {
      this.activitiesService.getActivitiesByProject(this.project.id).subscribe((activities) => {
        this.activities = activities;
      });
    }
  }
   getAllUsers(): void {
      this.usersService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0){
            this.usersDatas = response
          }
        }
      })
    }

  formatStatus(status: string): string{
    return status.replace(/_/g, ' ').toLowerCase();
  }

  formatDateRange(startDate: string, endDate: string): string {

    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split(' ')[0].split('/').map(Number);
      return new Date(year, month - 1, day);
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const startDay = start.getDate().toString().padStart(2, '0');
    const startMonth = start.toLocaleString('default', { month: 'short' }).replace('.', '');

    const endDay = end.getDate().toString().padStart(2, '0');
    const endMonth = end.toLocaleString('default', { month: 'short' }).replace('.', '') ;

    return `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ABERTA':
        return 'status status-aberta';
      case 'EM_ANDAMENTO':
        return 'status status-em-andamento';
      case 'CONCLUIDA':
        return 'status status-concluida';
      case 'PAUSADA':
        return 'status status-pausada';
      default:
        return 'status';
    }
  }


  backToProjects(): void {
    this.backToProjectsEvent.emit()
  }

  handleActivityEvent(action: string, id?: string): void {
    if (action && action !== ''){
      const activityEventData = id && id !== '' ? {action, id} : {action}
      this.activityEvent.emit(activityEventData);
    }
  }

  handleDeleteProject(id:number, name: string): void {
    if(id !== 0 && name !== ''){
      this.deleteProjectEvent.emit({
        id,
        name
      })
    }
  }

  handleSubmitEditProject(){
   if(this.editingProject){
    const startDate = this.editingProject.startDate instanceof Date ? this.formatDate(this.editingProject.startDate) : this.editingProject.startDate
    const endDate = this.editingProject.endDate instanceof Date ? this.formatDate(this.editingProject.endDate) : this.editingProject.endDate
    const updatedProject: EditProjectRequest = {
      id: this.editingProject.id,
      name: this.editingProject.name,
      description: this.editingProject.description,
      startDate: startDate,
      endDate: endDate,
      status: this.editingProject.status,
      idResponsableUser: this.editingProject.idResponsableUser.id,
      priority: this.editingProject.priority
    }
    this.projectService
    .editProject(updatedProject)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto atualizado com sucesso',
          life: 2500
        });
        this.projectService.getProjectById(this.project.id).subscribe(
          (response) => this.project = response)
        this.editingProject = null;
      },error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar projeto',
          life: 2500
        });
      }
    });
   }
  }



  private formatDate(date: any): string {
    const formattedDate = new Date(date);
    return this.datePipe.transform(formattedDate, "dd/MM/yyyy HH:mm:ss") || '';
  }

  private formatTimeForInput(dateStr: string): string {
    return dateStr.split(' ')[1].substring(0, 5);
  }

  startEditing(project: GetAllProjectsResponse): void{
    console.log(project)
    this.editingProject = {
      ...project,
      idResponsableUser: project.idResponsableUser,
      startHour: this.formatTimeForInput(project.startDate),
      endHour: this.formatTimeForInput(project.endDate)
    }
  }

  cancelEditing():void {
    this.editingProject = null
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
