import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesDataTransferService {

  public activitiesDataEmitter$ =
    new BehaviorSubject<Array<GetAllActivitiesResponse> | null>(null);
  public activitiesDatas: Array<GetAllActivitiesResponse> = [];

  setActivitiesDatas(activities: Array<GetAllActivitiesResponse>): void{
    if (activities){
      this.activitiesDataEmitter$.next(activities)
      this.getActivitiesDatas();
    }
  }

  getActivitiesDatas(){
    this.activitiesDataEmitter$
    .pipe(
      take(1)
    )
    .subscribe({
      next: (response) => {
        if (response){
          this.activitiesDatas = response
        }
      }
    });
    return this.activitiesDatas
  }
}
