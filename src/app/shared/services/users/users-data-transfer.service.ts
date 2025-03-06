import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';

@Injectable({
  providedIn: 'root'
})
export class UsersDataTransferService {

  public usersDataEmitter$ =
    new BehaviorSubject<Array<GetAllUsersResponse> | null>(null);
  public usersDatas: Array<GetAllUsersResponse> = [];

  // setUsersDatas

  getUsersDatas(){
    this.usersDataEmitter$
    .pipe(
      take(1)
    )
    .subscribe({
      next: (response) => {
        if (response){
          this.usersDatas = response
        }
      }
    })
    return this.usersDatas
  }
}
