import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsersFormComponent } from '../components/users-form/users-form.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users-home',
  templateUrl: './users-home.component.html',
  styleUrls: ['./users-home.component.scss']
})
export class UsersHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public usersDatas: Array<GetAllUsersResponse> = []

  constructor(
    private userService: UserService,
    private usersDtService: UsersDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
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

  handleUserAction(event: EventAction):void {
    if(event){
      this.ref = this.dialogService.open(UsersFormComponent,{
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex:10000,
        data: {
          event: event,
          usersDatas: this.usersDatas
        }
      });
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAPIUsersDatas(),
      })
    }
  }

  handleDeleteUserAction(event: {
    id: number,
    name: string
  }): void {
    if(event){
      this.confirmationService.confirm({
        message: `Deseja realmente desativar o usuário: ${event?.name}`,
        header: `Desativar usuário`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteUser(event?.id),
      })
    }
  }

  deleteUser(id: number){
    if(id){
      this.userService
      .deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário desativado com sucesso!',
            life: 2500
          });
          this.getAPIUsersDatas();
        }, error: (err) => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao desativar usuário!',
            life: 2500
          })
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
