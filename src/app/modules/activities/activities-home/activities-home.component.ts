import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { EventAction } from 'src/app/models/interface/projects/event/EventAction';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { ActivitiesDataTransferService } from 'src/app/shared/services/activities/activities-data-transfer.service';

@Component({
  selector: 'app-activities-home',
  templateUrl: './activities-home.component.html',
  styleUrls: ['./activities-home.component.scss']
})
export class ActivitiesHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public activitiesDatas: Array<GetAllActivitiesResponse> = []

  constructor(
    private activitiesService: ActivitiesService,
    private activitiesDtService: ActivitiesDataTransferService,
    private router: Router,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.getServiceActivitiesDatas();
  }

  getServiceActivitiesDatas(){
    const activitiesLoaded = this.activitiesDtService.getActivitiesDatas();

    if(activitiesLoaded.length > 0){
      this.activitiesDatas = activitiesLoaded;
    } else {
      this.getAPIActivitiesDatas();
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

  handleActivityAction(event: EventAction): void{
    if (event){
      console.log('Dados', event);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
