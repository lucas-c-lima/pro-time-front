import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
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

  getAllUsers(): Observable<Array<GetAllUsersResponse>>{
    return this.http.get<Array<GetAllUsersResponse>>(
      `${this.API_URL}/users`,
      this.httpOptions
    )
  }
}
