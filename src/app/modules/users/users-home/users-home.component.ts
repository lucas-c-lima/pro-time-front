import { MessageService } from 'primeng/api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';

@Component({
  selector: 'app-users-home',
  templateUrl: './users-home.component.html',
  styleUrls: ['./users-home.component.scss']
})
export class UsersHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public usersDatas: Array<GetAllUsersResponse> = []

  constructor(
    private userService: UsersService,
    private usersDtService: UsersDataTransferService,
    private router: Router,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
      this.getServiceUsersDatas();
  }

  getServiceUsersDatas() {
    const usersLoaded = this.usersDtService.getUsersDatas();

    if(usersLoaded.length > 0){
      this.usersDatas = usersLoaded;
    } else {
      this.getAPIUsersDatas();
    }

    console.log(usersLoaded)
  }

  getAPIUsersDatas(){
    this.userService
    .getAllUsers()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.usersDatas = response
        }
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity:'Error',
          summary: 'Erro',
          detail: 'Erro ao acessar a Usuarios',
          life: 2500,
        })
        this.router.navigate(['/dashboard'])
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
