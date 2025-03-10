import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss']
})
export class ToolbarNavigationComponent implements OnInit {
  items: MenuItem[] = [];


  constructor(
    private cookie: CookieService,
    private router: Router
  ){  }

  ngOnInit(): void {
    this.items = [
      {
        tooltipOptions: {
          tooltipLabel: 'Alterar senha',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-pencil',
        command: () => {
          // TODO ALTERAR SENHA
          console.log('Alterar senha')
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Sair',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-sign-out',
        command: () => {
          this.handleLogout();
        }
      }
    ];
  }

  handleEditPassword():void {
    console.log('editar')
  }

  handleLogout():void{
    this.cookie.deleteAll();
    void this.router.navigate(["/home"])
  }
}
