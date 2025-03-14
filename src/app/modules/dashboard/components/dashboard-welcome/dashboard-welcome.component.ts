import { UserService } from 'src/app/services/user/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { HoursService } from 'src/app/services/hours/hours.service';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { GetAllEntriesResponse } from 'src/app/models/interface/hours/response/GetAllEntriesResponse';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';

@Component({
  selector: 'app-dashboard-welcome',
  templateUrl: './dashboard-welcome.component.html',
  styleUrls: ['./dashboard-welcome.component.scss']
})
export class DashboardWelcomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  currentDate: string = '';
  username: string = 'Colaborador'

  filteredHoursCount: number = 0
  completedTasksCount: number = 0
  hours: Array<GetAllEntriesResponse> = []
  activities: Array<GetAllActivitiesResponse> = []
  filteredActivities: Array<GetAllActivitiesResponse> = []
  periodSelect: string[] = [
    'Última semana',
    'Último mês'
  ];
  selectedPeriod: string = 'Última semana'


  constructor(
    private UserService: UserService,
    private hoursService: HoursService,
    private activitiesService: ActivitiesService,
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
          this.loadHours(Number(user.id));

          this.loadCompletedTasksCount(Number(user.id))
        }
      )
    }
  }

  loadHours(idUser: number): void{
    this.hoursService.getHoursByUser(idUser).pipe(takeUntil(this.destroy$)).subscribe((hours) => {
      this.hours = hours
      this.onPeriodChange()
    });
  }

  loadCompletedTasksCount(idUser: number): void{
    this.activitiesService.getActivitiesByUser(idUser).pipe(takeUntil(this.destroy$)).subscribe((activities)=> {
      this.activities = activities
      this.onPeriodChange()
    })
  }

  onPeriodChange(): void {
    const today = new Date();
    let startDate: Date;
    this.filteredHoursCount = 0

    switch(this.selectedPeriod){
      case 'Última semana':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
    case 'Último mês':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      break;
    }
    this.hours.filter(times => {
      const entryRegister = this.convertToISO(times.registerDate)
      if(entryRegister >= startDate){
        this.filteredHoursCount += this.calculateHours(times.startDate, times.endDate)
      }
    })
    this.filteredActivities = this.activities.filter(completed => {
      const creationDate = this.convertToISO(completed.creationDate)
      return (creationDate >= startDate)
    })

    this.completedTasksCount = this.filteredActivities.filter(activity => activity.status === 'CONCLUIDA').length

  }

  calculateHours(startDate: string, endDate: string): number{

    const parseDateTime = (dateTimeStr: string): Date => {
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const start = parseDateTime(startDate)
    const end = parseDateTime(endDate)
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours;
  }

  private convertToISO(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');

    const isoString = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

    return new Date(isoString);
  }

  formatDateRange(startDate: string, endDate: string): string {

    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split(' ')[0].split('/').map(Number);
      return new Date(year, month - 1, day);
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const startDay = start.getDate().toString().padStart(2, '0');
    const startMonth = start.toLocaleString('default', { month: 'short' }).replace('.', '');

    const endDay = end.getDate().toString().padStart(2, '0');
    const endMonth = end.toLocaleString('default', { month: 'short' }).replace('.', '') ;

    return `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
