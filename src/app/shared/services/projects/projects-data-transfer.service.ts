import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProjectsDataTransferService {

  public projectsDataEmitter$ =
    new BehaviorSubject<Array<GetAllProjectsResponse> | null>(null);
  public projectsDatas: Array<GetAllProjectsResponse> = [];

  setProjectsDatas(projects: Array<GetAllProjectsResponse>): void {
    if (projects){
      this.projectsDataEmitter$.next(projects)
      this.getProjectsDatas();
    }
  }

  getProjectsDatas() {
    this.projectsDataEmitter$
    .pipe(
      take(1)
    )
    .subscribe({
      next: (response) => {
        if(response){
          this.projectsDatas = response;
        }
      }
    });
    return this.projectsDatas;
  }
}
