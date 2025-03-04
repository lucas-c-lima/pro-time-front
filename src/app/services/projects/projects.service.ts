import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
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
    // // FILTROS!!!!
    // .pipe(
    //   map((project) => project.filter((data) => data?.status == "EM_ANDAMENTO"))
    // )
  }
}
