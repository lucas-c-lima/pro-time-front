
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { UserEvent } from 'src/app/models/enums/users/UserEvent';
import { UserProfile } from 'src/app/models/enums/users/UserProfile';
import { UserStatus } from 'src/app/models/enums/users/UserStatus';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { EditUserRequest } from 'src/app/models/interface/users/request/EditUserRequest';
import { RegisterUserRequest } from 'src/app/models/interface/users/request/RegisterUserRequest';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { UserService } from 'src/app/services/user/user.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();

  public userAction!:{
    event: EventAction;
    usersDatas: Array<GetAllUsersResponse>
  }
  public userSelectedDatas!: GetAllUsersResponse;
  public usersDatas: Array<GetAllUsersResponse> = [];
  public profileOptions = Object.keys(UserProfile).map(key => ({
    id: key,
    name: UserProfile[key as keyof typeof UserProfile]
  }))
  public statusOptions = [
    { label: 'Ativo', value: false },
    { label: 'Inativo', value: true }
  ];

  public addUserForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    profile: ['USUARIO', Validators.required]
  })

  public editUserForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: [''],
    profile: ['', Validators.required],
    deleted: [false, Validators.required],
  })

  public addUserAction = UserEvent.ADD_USER_EVENT
  public editUserAction = UserEvent.EDIT_USER_EVENT

  constructor(
    private usersService: UserService,
    private usersDtService: UsersDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private ref: DynamicDialogConfig
  ){}

  ngOnInit(): void {
    this.userAction = this.ref.data;

    if(this.userAction?.event?.action === this.editUserAction &&
      this.userAction?.usersDatas
    ){
      this.getUserSelectedDatas(Number(this.userAction?.event?.id) as number);
    }
  }

  handleSubmitAddUser(): void {
    if(this.addUserForm?.value && this.addUserForm?.valid){
      const requestRegisterUser: RegisterUserRequest = {
        name: this.addUserForm.value.name as string,
        email: this.addUserForm.value.email as string,
        password: this.addUserForm.value.password as string,
        profile: this.addUserForm.value.profile as string,
      }

      this.usersService.registerUser(requestRegisterUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário registrado com sucesso!',
              life: 2500
            })
          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao registrar usuário!',
            life: 2500
          })
        }
      })
    }
    this.addUserForm.reset();
  }

  handleSubmitEditUser(): void{
    if(this.editUserForm.value && this.editUserForm.valid && this.userAction.event.id){
      const requestEditUser: EditUserRequest = {
        id: Number(this.userAction?.event?.id),
        name: this.editUserForm.value.name as string,
        email: this.editUserForm.value.email as string,
        password: this.editUserForm.value.password || null,
        profile: this.editUserForm.value.profile as string,
        deleted: this.editUserForm.value.deleted as boolean
      };

      this.usersService
      .editUser(requestEditUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário editado com sucesso',
            life: 2500
          })
          this.editUserForm.reset();
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editar usuário',
            life: 2500
          })
        }
      })
    }
  }

  getUserSelectedDatas(id: number):void{
    const allUsers = this.userAction?.usersDatas;

    if(allUsers.length > 0){
      const userFilter = allUsers.filter(
        (element) => element?.id === id
      );
      if(userFilter){
        this.userSelectedDatas = userFilter[0];
        this.editUserForm.setValue({
          name:this.userSelectedDatas?.name,
          email:this.userSelectedDatas?.email,
          password: '',
          profile:this.userSelectedDatas?.profile,
          deleted: this.userSelectedDatas?.deleted
        })
      }
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
