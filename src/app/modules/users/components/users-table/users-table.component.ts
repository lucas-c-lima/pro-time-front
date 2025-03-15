import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserEvent } from 'src/app/models/enums/users/UserEvent';
import { DeleteUserAction } from 'src/app/models/interface/users/event/DeleteUserAction';
import { EventActionUsers } from 'src/app/models/interface/users/event/EventActionUsers';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {
  @Input() users: Array<GetAllUsersResponse> = []
  @Output() userEvent = new EventEmitter<EventActionUsers>();
  @Output() deleteUserEvent = new EventEmitter<DeleteUserAction>();

  public userSelected!: GetAllUsersResponse;
  public addUserEvent = UserEvent.ADD_USER_EVENT;
  public editUserEvent = UserEvent.EDIT_USER_EVENT;
  constructor(private usersService: UserService){}

  ngOnInit():void {
    this.loadUsers();
  }

  loadUsers(): void{
    this.usersService.getAllUsers().subscribe((users) => {
      this.users = users;
    })
  }

  handleUserEvent(action: string, id?: string): void {
    if(action && action !== ''){
      const userEventData = id && id !== '' ? {action, id} : {action}
      this.userEvent.emit(userEventData);
    }
  }

  handleDeleteUser(id:number, name:string): void {
    if(id !== 0 && name !== ''){
      this.deleteUserEvent.emit({
        id,
        name
      })
    }
  }

  formatProfile(profile: string): string{
    return profile.toLowerCase();
  }

  getProfileClass(profile: string): string{
    switch(profile){
      case 'USUARIO':
        return 'profile profile-usuario';
      case 'ADMIN':
        return 'profile profile-admin';
      default:
        return 'profile'
    }
  }

  getDeleted(deleted: boolean): string{
    switch(deleted){
      case true:
        return 'user-deleted'
      case false:
        return 'user'
      default:
        return 'user'
    }
  }
}
