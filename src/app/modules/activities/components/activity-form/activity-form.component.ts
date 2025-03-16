import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { elementAt, Subject, takeUntil } from 'rxjs';
import { ActivityEvent } from 'src/app/models/enums/activities/ActivityEvent';
import { ActivityStatus } from 'src/app/models/enums/activities/ActivityStatus';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { CreateActivityRequest } from 'src/app/models/interface/activities/request/CreateActivityRequest';
import { EditActivityRequest } from 'src/app/models/interface/activities/request/EditActivityRequest';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { CreateEntryRequest } from 'src/app/models/interface/hours/request/CreateEntryRequest';
import { EditEntryRequest } from 'src/app/models/interface/hours/request/EditEntryRequest';
import { GetAllEntriesResponse } from 'src/app/models/interface/hours/response/GetAllEntriesResponse';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { HoursService } from 'src/app/services/hours/hours.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { UserService } from 'src/app/services/user/user.service';
import { ActivitiesDataTransferService } from 'src/app/shared/services/activities/activities-data-transfer.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();

  public userProfileValue = this.cookie.get("USER_PROFILE")
  public userIdValue = Number(this.cookie.get("USER_ID"))

  public projectDatas: Array<GetAllProjectsResponse> = [];
  public selectedProject: Array<{name: string; code: string}> = [];

  public usersDatas: Array<GetAllUsersResponse> = [];
  public selectedUsers: Array<{name: string; code: string}> = [];

  hoursEntries: any[] = []
  public hoursDatas: Array<GetAllEntriesResponse> = [];
  editingEntry: any = null;

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

  public hoursActivityForm = this.formBuilder.group({
    activity: [0],
    responsableUser: [0, Validators.required],
    description: ['', Validators.required],
    entryDay: ['', Validators.required],
    startHour: ['', Validators.required],
    endHour: ['', Validators.required]
  })

  public addActivityAction = ActivityEvent.ADD_ACTIVITY_EVENT;
  public editActivityAction = ActivityEvent.EDIT_ACTIVITY_EVENT;
  public hoursActivityAction = ActivityEvent.HOURS_ACTIVITY_EVENT;

  constructor(
    private projectsService: ProjectsService,
    private usersService: UserService,
    private hoursService: HoursService,
    private activitiesService: ActivitiesService,
    private activitiesDtService: ActivitiesDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private datePipe: DatePipe,
    public ref: DynamicDialogConfig,
    public cookie: CookieService
  ){}

  ngOnInit(): void {
    this.activityAction = this.ref.data;
    if(
      this.activityAction?.event?.action === this.editActivityAction &&
      this.activityAction?.activitiesDatas
    ){
      this.getActivitySelectedDatas(Number(this.activityAction?.event?.id) as number);
    } else if(
      this.activityAction?.event?.action === this.hoursActivityAction &&
      this.activityAction?.activitiesDatas
    ){
      this.getActivitySelectedDatas(Number(this.activityAction?.event?.id) as number);
    }

    this.getAllProjects();
    this.getAllUsers();
  }

  // --- GET ----------------
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

  getActivitySelectedDatas(activityId: number): void{
    const allActivities = this.activityAction?.activitiesDatas;

    if (allActivities.length > 0){
      const activityFilter = allActivities.filter(
        (element) => element?.id === activityId
      );
      if(activityFilter && this.activityAction?.event?.action === this.editActivityAction){
        this.activitySelectedDatas = activityFilter[0];
        this.editActivityForm.setValue({
          name: this.activitySelectedDatas?.name,
          description: this.activitySelectedDatas?.description,
          startDate: this.activitySelectedDatas?.startDate,
          endDate: this.activitySelectedDatas?.endDate,
          status: this.activitySelectedDatas?.status,
          responsableUser: String(this.activitySelectedDatas?.idResponsableUser.id),
          project: String(this.activitySelectedDatas?.projectId.id)
        })
      }
      else if (activityFilter && this.activityAction?.event?.action === this.hoursActivityAction){
        this.activitySelectedDatas = activityFilter[0];
        this.hoursActivityForm.setValue({
          activity: this.activitySelectedDatas?.id,
          responsableUser: this.activitySelectedDatas?.idResponsableUser.id,
          description: '',
          entryDay: '',
          startHour: '',
          endHour: ''
        })
        this.getActivityHours(this.activitySelectedDatas?.id)
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

  getActivityHours(activityId: number):void {
    this.hoursService.getHoursByActivity(String(activityId))
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.hoursDatas = response
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar horas anteriores',
          life: 2500
        });
      }
    })
  }

  // --- HANDLES ------------
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
        projectId: Number(this.addActivityForm.value.project),
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
      const startDate = typeof(this.editActivityForm.value.startDate) !== 'string' ? this.formatDate(this.editActivityForm.value.startDate) : this.editActivityForm.value.startDate
      const endDate = typeof(this.editActivityForm.value.endDate) !== 'string' ? this.formatDate(this.editActivityForm.value.endDate) : this.editActivityForm.value.endDate

      const requestEditActivity: EditActivityRequest = {
        id: Number(this.activityAction?.event?.id),
        name: this.editActivityForm.value.name as string,
        description: this.editActivityForm.value.description as string,
        startDate: startDate as string,
        endDate: endDate as string,
        status: this.editActivityForm.value.status as string,
        projectId: Number(this.editActivityForm.value.project),
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
            detail: 'Erro ao editar atividade',
            life: 2500
          })
        }
      })
    }
  }

  handleSubmitHoursActivity(): void{
    if(this.hoursActivityForm.value &&
      this.hoursActivityForm.valid &&
      this.activityAction.event.id){

        let formattedDateStart = ''
        const entryDay = this.hoursActivityForm.value.entryDay
        const startHour = this.hoursActivityForm.value.startHour
        let formattedDateEnd = ''
        const endHour = this.hoursActivityForm.value.endHour
        if(entryDay && startHour && endHour){
          formattedDateStart = this.formatDateTime(new Date(entryDay), startHour)
          formattedDateEnd = this.formatDateTime(new Date(entryDay), endHour)

          const requestEntryHours: CreateEntryRequest = {
            idActivity: Number(this.hoursActivityForm.value.activity),
            idUser: Number(this.hoursActivityForm.value.responsableUser),
            description: this.hoursActivityForm.value.description || '',
            startDate: formattedDateStart,
            endDate: formattedDateEnd
          }

          this.hoursService
          .registerHour(requestEntryHours)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Lançamento de horas registradas com sucesso',
                life: 2500
              })
              this.getActivityHours(this.activitySelectedDatas.id);
              this.hoursActivityForm.reset();
            }, error: (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao registrar horas',
                life: 2500
              })
            }
          })
        }
      }
  }

  handleSubmitEditHours():void{
    if (this.editingEntry) {
      const updatedEntry: EditEntryRequest ={
        id: this.editingEntry.id,
        idActivity: this.editingEntry.idActivity,
        idUser: this.editingEntry.idUser,
        description: this.editingEntry.description,
        startDate: this.formatDateTime(new Date(this.editingEntry.startDate), this.editingEntry.startHour),
        endDate: this.formatDateTime(new Date(this.editingEntry.startDate), this.editingEntry.endHour)
      };
      this.hoursService
        .editHour(updatedEntry)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Registro de horas atualizado com sucesso',
              life: 2500
            });
            const index = this.hoursDatas.findIndex(entry => entry.id === this.editingEntry.id);
            if (index !== -1) {
              this.hoursDatas[index] = {...this.editingEntry, ...updatedEntry};
            }
            this.editingEntry = null;
          },error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar registro de horas',
              life: 2500
            });
          }
        });
    }
  }

  handleDeleteHour(id: number): void{
    this.hoursService
    .deleteHour(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Registro de horas deletado com sucesso',
          life: 2500
        });
        this.getActivityHours(this.activitySelectedDatas.id);
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao deletar registro de horas',
          life: 2500
        });
      }
    });
  }

  // --- FORMATS ------------
  private formatDate(date: any): string {
    const formattedDate = new Date(date);
    return this.datePipe.transform(formattedDate, "dd/MM/yyyy HH:mm:ss") || '';
  }

  formatDateEntry(startDate: string, endDate: string): string{
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

  formatDateTimeRangeHours(startDate: string, endDate: string): string{
    const parseDateTime = (dateTimeStr: string): Date => {
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };
    const start = parseDateTime(startDate);
    const end = parseDateTime(endDate);

    const day = start.getDate().toString().padStart(2, '0');
    const month = (start.getMonth() + 1).toString().padStart(2, '0');
    const year = start.getFullYear();

    const startHour = start.getHours().toString().padStart(2, '0');
    const startMinute = start.getMinutes().toString().padStart(2, '0');

    const endHour = end.getHours().toString().padStart(2, '0');
    const endMinute = end.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} - ${startHour}:${startMinute} às ${endHour}:${endMinute}`;
  }

  private formatDateTime(date: Date, time: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} ${time}:00`;
  }

  private formatTimeForInput(dateStr: string): string {
    return dateStr.split(' ')[1].substring(0, 5);
  }

  // --- OTHER --------------
  calculateHours(startDate: string, endDate: string): string{

    const parseDateTime = (dateTimeStr: string): Date => {
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const start = parseDateTime(startDate)
    const end = parseDateTime(endDate)
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}`;
  }

  startEditing(entry: GetAllEntriesResponse):void {
    this.editingEntry = {
      ...entry,
      idActivity: entry.idActivities.id,
      idUser: entry.idUsers.id,
      startHour: this.formatTimeForInput(entry.startDate),
      endHour: this.formatTimeForInput(entry.endDate)
    }

  }

  cancelEditing():void {
    this.editingEntry = null
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
