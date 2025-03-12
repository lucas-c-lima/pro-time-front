import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CreateEntryRequest } from 'src/app/models/interface/hours/request/CreateEntryRequest';
import { GetAllEntriesResponse } from 'src/app/models/interface/hours/response/GetAllEntriesResponse';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HoursService {
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
    private cookie: CookieService
  ) { }

  getAllHours(): Observable<Array<GetAllEntriesResponse>>{
    return this.http.get<Array<GetAllEntriesResponse>>(
      `${this.API_URL}/entries`,
      this.httpOptions
    )
  }

  registerHour(requestDatas: CreateEntryRequest): Observable<CreateEntryRequest>{
    console.log(requestDatas)
    return this.http.post<CreateEntryRequest>(
      `${this.API_URL}/entries`, requestDatas,
      this.httpOptions
    )
  }
}
