import { UserService } from 'src/app/services/user/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard-welcome',
  templateUrl: './dashboard-welcome.component.html',
  styleUrls: ['./dashboard-welcome.component.scss']
})
export class DashboardWelcomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  currentDate: string = '';
  username: string = 'Colaborador'

  hoursCount: number = 0
  completedTasksCount: number = 0
  periodSelect: MenuItem[] = [
    { label: 'Última semana', id: 'lastWeek' },
    { label: 'Último mês', id: 'lastMonth' }
  ];
  selectedPeriod: string = 'lastWeek'


  constructor(
    private UserService: UserService,
    private cookie: CookieService
  ){}

  ngOnInit(): void {
    this.currentDate = this.getCurrentDate();
    this.loadUser();
  }

  getCurrentDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', day: 'numeric', month: 'long'
    };
    return this.capitalizeFirstLetter(
      date.toLocaleDateString('pt-BR', options)
    )
  }

  capitalizeFirstLetter(dateString: string): string {
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  }

  loadUser(): void{
    const userId = this.cookie.get('USER_ID');
    if(userId){
      this.UserService.getUserById(Number(userId))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        user => {
          this.username = user.name.split(' ')[0]
        }
      )
    }
  }

  loadHoursCount(eventId: string): void{
    // TODO logica para filtro por mes/semana
  }

  loadCompletedTaksCount(eventId: string): void{
    // TODO logica para filtro por mes/semana
  }

  onPeriodChange(event: any): void {
    // TODO logica para coletar os novos dados
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
