import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthRequest } from 'src/app/models/interface/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interface/user/auth/AuthResponse';
import { environment } from 'src/environments/environments';
import { CookieService } from 'ngx-cookie-service';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { RegisterUserRequest } from 'src/app/models/interface/users/request/RegisterUserRequest';
import { RegisterUserResponse } from 'src/app/models/interface/users/response/RegisterUserResponse';
import { EditUserRequest } from 'src/app/models/interface/users/request/EditUserRequest';
import { DeleteUserResponse } from 'src/app/models/interface/users/response/DeleteUserResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get("USER_TOKEN")
  private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.JWT_TOKEN}`
      })
    }

  constructor(private http: HttpClient, private cookie: CookieService) { }

  authUser(requestDatas: AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, requestDatas)
  }

  getUserIdFromToken(token: string): string {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.userId || null;
  }

  getProfileFromToken(token: string): string {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.userProfile || null;
  }

  isLoggedIn(): boolean{
    const JWT_TOKEN = this.cookie.get("USER_TOKEN")
    return JWT_TOKEN ? true : false;
  }

  getAllUsers(): Observable<Array<GetAllUsersResponse>>{
    return this.http.get<Array<GetAllUsersResponse>>(
      `${this.API_URL}/users`,
      this.httpOptions
    )
  }

  getUserById(userId: string): Observable<GetAllUsersResponse>{
    return this.http.get<GetAllUsersResponse>(
      `${this.API_URL}/users/${userId}`,
      this.httpOptions
    )
  }

  registerUser(requestDatas: RegisterUserRequest): Observable<RegisterUserResponse>{
    return this.http.post<RegisterUserResponse>(
      `${this.API_URL}/auth/register`, requestDatas,
      this.httpOptions
    )
  }

  editUser(requestDatas: EditUserRequest): Observable<void>{
    return this.http.put<void>(
      `${this.API_URL}/users/${requestDatas.id}`,
      requestDatas,
      this.httpOptions
    )
  }

  deleteUser(id:number): Observable<DeleteUserResponse>{
    return this.http.delete<DeleteUserResponse>(
      `${this.API_URL}/users/${id}`,
      this.httpOptions
    )
  }
}
