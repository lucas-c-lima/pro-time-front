import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environments';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';

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
}
