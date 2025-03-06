import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { CreateActivityRequest } from 'src/app/models/interface/activities/request/CreateActivityRequest';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { UsersService } from 'src/app/services/users/users.service';

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

  public addActivityForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['ABERTA', Validators.required],
    responsableUser: ['', Validators.required],
    project: ['', Validators.required]
  })

  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private datePipe: DatePipe
  ){}

  ngOnInit(): void {
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

  private formatDate(date: any): string{
    const formattedDate = new Date(date);
    return this.datePipe.transform(formattedDate, "dd/MM/yyyy") || '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
