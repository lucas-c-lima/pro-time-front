import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { CreateProjectRequest } from 'src/app/models/interface/projects/request/CreateProjectRequest';
import { EditProjectRequest } from 'src/app/models/interface/projects/request/EditProjectRequest';
import { CreateProjectResponse } from 'src/app/models/interface/projects/response/CreateProjectResponse';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
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

  getAllProjects(): Observable<Array<GetAllProjectsResponse>>{
    return this.http.get<Array<GetAllProjectsResponse>>(
      `${this.API_URL}/projects`,
      this.httpOptions
    )
  }

  getProjectById(projectId: number): Observable<GetAllProjectsResponse>{
    return this.http.get<GetAllProjectsResponse>(
      `${this.API_URL}/projects/${projectId}`,
      this.httpOptions
    )
  }

  createProject(requestDatas: CreateProjectRequest): Observable<CreateProjectResponse>{
    return this.http.post<CreateProjectResponse>(
      `${this.API_URL}/projects`, requestDatas,
      this.httpOptions
    )
  }

  editProject(requestDatas: EditProjectRequest): Observable<EditProjectRequest>{
    console.log(requestDatas)
    return this.http.put<EditProjectRequest>(
      `${this.API_URL}/projects/${requestDatas.id}`, requestDatas,
      this.httpOptions
    )
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/projects/${projectId}`,
      this.httpOptions
    )
  }

}
