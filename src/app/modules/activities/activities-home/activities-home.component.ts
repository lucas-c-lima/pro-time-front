import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { ActivitiesDataTransferService } from 'src/app/shared/services/activities/activities-data-transfer.service';
import { ActivityFormComponent } from '../components/activity-form/activity-form.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-activities-home',
  templateUrl: './activities-home.component.html',
  styleUrls: ['./activities-home.component.scss']
})
export class ActivitiesHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public activitiesDatas: Array<GetAllActivitiesResponse> = [];

  userIdValue :string = this.cookie.get('USER_PROFILE');
  userId :string = this.cookie.get('USER_ID');
  private adminRoute = ''

  constructor(
    private activitiesService: ActivitiesService,
    private activitiesDtService: ActivitiesDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private cookie: CookieService
  ){
    router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.adminRoute = event.url
      }
    });
  }

  ngOnInit(): void {
    this.getServiceActivitiesDatas();
  }

  getServiceActivitiesDatas(){
    this.getAPIActivitiesDatas();
  }

  getAPIActivitiesDatas() {
    if(this.userIdValue == 'ADMIN' && this.adminRoute == '/admin/activities'){
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
    } else {
      this.activitiesService
      .getActivitiesByUser(Number(this.userId))
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
  }

  handleActivityAction(event: EventAction): void{
    if (event){
      this.ref = this.dialogService.open(ActivityFormComponent,{
        header: event?.action,
        contentStyle: { overflow: 'auto'},
        baseZIndex: 10000,
        data: {
          event: event,
          activitiesDatas: this.activitiesDatas
        }
      });
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAPIActivitiesDatas(),
      })
    }
  }

  handleDeleteActivityAction(event:{
    id: number,
    name: string
  }): void {
    if(event){
      this.confirmationService.confirm({
        message: `Deseja realmente deletar a atividade: ${event?.name}?`,
        header: `Deletar atividade`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteActivity(event?.id),
      })
    }
  }

  deleteActivity(id: number){
    if(id){
      this.activitiesService
      .deleteActivity(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Atividade removida com sucesso!',
            life: 2500
          });
          this.getAPIActivitiesDatas();
        }, error: (err) => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao remover atividade!',
            life: 2500
          })
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
