import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';

@Component({
  selector: 'app-menu-navigation',
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.scss']
})
export class MenuNavigationComponent {

userIdValue: string = this.cookie.get('USER_PROFILE')

constructor(private cookie: CookieService){}

}
