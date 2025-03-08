import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { elementAt, Subject, takeUntil } from 'rxjs';
import { ActivityEvent } from 'src/app/models/enums/activities/ActivityEvent';
import { ActivityStatus } from 'src/app/models/enums/activities/ActivityStatus';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { CreateActivityRequest } from 'src/app/models/interface/activities/request/CreateActivityRequest';
import { EditActivityRequest } from 'src/app/models/interface/activities/request/EditActivityRequest';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivitiesDataTransferService } from 'src/app/shared/services/activities/activities-data-transfer.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();

  public projectDatas: Array<GetAllProjectsResponse> = [];
  public selectedProject: Array<{name: string; code: string}> = [];

  public usersDatas: Array<GetAllUsersResponse> = [];
  public selectedUsers: Array<{name: string; code: string}> = [];

  public minDate: Date = new Date()
  public statusOptions = Object.keys(ActivityStatus).map(key => ({
    id: key,
    name: ActivityStatus[key as keyof typeof ActivityStatus]
  }));
  public selectedStatus: Array<{name: string; code: string}> = [];


  public activityAction!:{
    event: EventAction;
    activitiesDatas: Array<GetAllActivitiesResponse>
  }
  public activitySelectedDatas!: GetAllActivitiesResponse;
  public activitiesDatas: Array<GetAllActivitiesResponse> = [];

  public addActivityForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['ABERTA', Validators.required],
    responsableUser: ['', Validators.required],
    project: ['', Validators.required]
  })

  public editActivityForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['', Validators.required],
    responsableUser: ['', Validators.required],
    project: ['', Validators.required]
  })


  public addActivityAction = ActivityEvent.ADD_ACTIVITY_EVENT;
  public editActivityAction = ActivityEvent.EDIT_ACTIVITY_EVENT;
  public finishActivityAction = ActivityEvent.FINISH_ACTIVITY_EVENT;

  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private activitiesDtService: ActivitiesDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private datePipe: DatePipe,
    public ref: DynamicDialogConfig
  ){}

  ngOnInit(): void {
    this.activityAction = this.ref.data;

    if(
      this.activityAction?.event?.action === this.editActivityAction &&
      this.activityAction?.activitiesDatas
    ){
      this.getActivitySelectedDatas(Number(this.activityAction?.event?.id) as number);

    }

    this.activityAction?.event?.action === this.finishActivityAction && this.getActivityDatas();

    this.getAllProjects();
    this.getAllUsers();
  }

  getAllProjects(): void {
    this.projectsService.getAllProjects()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0){
          this.projectDatas = response
        }
      }
    })
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

  handleSubmitAddActivity(): void {
    if(this.addActivityForm?.value && this.addActivityForm?.valid){
      const startDate = this.formatDate(this.addActivityForm.value.startDate);
      const endDate = this.formatDate(this.addActivityForm.value.endDate);

      const requestCreateActivity: CreateActivityRequest = {
        name: this.addActivityForm.value.name as string,
        description: this.addActivityForm.value.description as string,
        startDate: startDate,
        endDate: endDate,
        status: this.addActivityForm.value.status as string,
        idProjects: Number(this.addActivityForm.value.project),
        idResponsableUser: Number(this.addActivityForm.value.responsableUser)
      };

      this.activitiesService.createActivity(requestCreateActivity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Atividade criada com sucesso!',
              life: 2500
            })
          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto!',
            life: 2500
          })
        }
      })
    }

    this.addActivityForm.reset();
  }

  handleSubmitEditActivity(): void{
    if(this.editActivityForm.value && this.editActivityForm.valid && this.activityAction.event.id){
      const requestEditActivity: EditActivityRequest = {
        id: Number(this.activityAction?.event?.id),
        name: this.editActivityForm.value.name as string,
        description: this.editActivityForm.value.description as string,
        startDate: this.editActivityForm.value.startDate as string,
        endDate: this.editActivityForm.value.startDate as string,
        status: this.editActivityForm.value.status as string,
        idProjects: Number(this.editActivityForm.value.project),
        idResponsableUser: Number(this.editActivityForm.value.responsableUser)
      };

      this.activitiesService
      .editActivity(requestEditActivity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Atividade editada com sucesso',
            life: 2500
          })
          this.editActivityForm.reset();
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editar produto',
            life: 2500
          })
          this.editActivityForm.reset();
        }
      })
    }
  }

  getActivitySelectedDatas(activityId: number): void{
    const allActivities = this.activityAction?.activitiesDatas;

    if (allActivities.length > 0){
      const activityFilter = allActivities.filter(
        (element) => element?.id === activityId
      );
      if(activityFilter){
        this.activitySelectedDatas = activityFilter[0];
        this.editActivityForm.setValue({
          name: this.activitySelectedDatas?.name,
          description: this.activitySelectedDatas?.description,
          startDate: this.activitySelectedDatas?.startDate,
          endDate: this.activitySelectedDatas?.endDate,
          status: this.activitySelectedDatas?.status,
          responsableUser: String(this.activitySelectedDatas?.idResponsableUser.id),
          project: String(this.activitySelectedDatas?.idProjects.id)
        })
      }
    }
  }

  getActivityDatas(): void {
    this.activitiesService.getAllActivities()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0){
          this.activitiesDatas = response;
          this.activitiesDatas && this.activitiesDtService.setActivitiesDatas(this.activitiesDatas);
        }
      }
    })
  }

  private formatDate(date: any): string {
    const formattedDate = new Date(date);
    return this.datePipe.transform(formattedDate, "dd/MM/yyyy HH:mm:ss") || '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
