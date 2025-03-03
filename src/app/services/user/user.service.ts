import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthRequest } from 'src/app/models/interface/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interface/user/auth/AuthResponse';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

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
}
