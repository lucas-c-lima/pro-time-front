import { CreateActivityRequest } from './../../models/interface/activities/request/CreateActivityRequest';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environments';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { CreateActivityResponse } from 'src/app/models/interface/activities/response/CreateActivityResponse';
import { EditActivityRequest } from 'src/app/models/interface/activities/request/EditActivityRequest';
import { DeleteActivityResponse } from 'src/app/models/interface/activities/response/DeleteActivityResponse';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get("USER_TOKEN")
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  }

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) { }

  getAllActivities(): Observable<Array<GetAllActivitiesResponse>>{
    return this.http.get<Array<GetAllActivitiesResponse>>(
      `${this.API_URL}/activities`,
      this.httpOptions
    )
  }

  getActivitiesByProject(projectId: number): Observable<Array<GetAllActivitiesResponse>>{
    return this.http.get<Array<GetAllActivitiesResponse>>(
      `${this.API_URL}/activities/project/${projectId}`,
      this.httpOptions
    )
  }

  getActivitiesByUser(userId: number): Observable<Array<GetAllActivitiesResponse>>{
    return this.http.get<Array<GetAllActivitiesResponse>>(
      `${this.API_URL}/activities/user/${userId}`,
      this.httpOptions
    )
  }

  createActivity(requestDatas: CreateActivityRequest): Observable<CreateActivityResponse>{
    return this.http.post<CreateActivityResponse>(
      `${this.API_URL}/activities`, requestDatas,
      this.httpOptions
    )
  }

  editActivity(requestDatas: EditActivityRequest): Observable<void>{
    return this.http.put<void>(
      `${this.API_URL}/activities/${requestDatas.id}`,
      requestDatas,
      this.httpOptions
    )
  }

  deleteActivity(id: number): Observable<DeleteActivityResponse>{
    return this.http.delete<DeleteActivityResponse>(
      `${this.API_URL}/activities/${id}`,
      this.httpOptions
    )
  }
}
