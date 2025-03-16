import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { ActivityEvent } from 'src/app/models/enums/activities/ActivityEvent';
import { DeleteActivityAction } from 'src/app/models/interface/activities/event/DeleteActivityAction';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { GetAllEntriesResponse } from 'src/app/models/interface/hours/response/GetAllEntriesResponse';
import { ActivitiesService } from 'src/app/services/activities/activities.service';

@Component({
  selector: 'app-activities-table',
  templateUrl: './activities-table.component.html',
  styleUrls: ['./activities-table.component.scss']
})
export class ActivitiesTableComponent {
  private readonly destroy$: Subject<void> = new Subject();

  @Input() activities: Array<GetAllActivitiesResponse> = []
  @Output() activityEvent = new EventEmitter<EventAction>();
  @Output() deleteActivityEvent = new EventEmitter<DeleteActivityAction>();

  userIdValue :string = this.cookie.get('USER_PROFILE');
  userId :string = this.cookie.get('USER_ID');
  private adminRoute = ''

  public activitySelected!: GetAllActivitiesResponse;
  public addActivityEvent = ActivityEvent.ADD_ACTIVITY_EVENT;
  public editActivityEvent = ActivityEvent.EDIT_ACTIVITY_EVENT;
  public hoursActivityAction = ActivityEvent.HOURS_ACTIVITY_EVENT;
  constructor(
    private activitiesService: ActivitiesService,
    private cookie: CookieService,
    private route: Router) {
      route.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
              this.adminRoute = event.url
            }
          });
    }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    if(this.userIdValue === 'ADMIN' && this.adminRoute == '/admin/activities'){
      this.activitiesService.getAllActivities().subscribe((activities) => {
        this.activities = activities
      })
    } else {
      this.activitiesService.getActivitiesByUser(Number(this.userId)).subscribe((activities) => {
        this.activities = activities;
      });
    }
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

  formatStatus(status: string): string{
    return status.replace(/_/g, ' ').toLowerCase();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ABERTA':
        return 'status status-aberta';
      case 'EM_ANDAMENTO':
        return 'status status-em-andamento';
      case 'CONCLUIDA':
        return 'status status-concluida';
      case 'PAUSADA':
        return 'status status-pausada';
      default:
        return 'status';
    }
  }

  getDeleted(deleted: boolean): string{
    switch(deleted){
      case true:
        return 'activity-deleted'
      case false:
        return 'activity'
      default:
        return 'activity'
    }
  }

  getIconClass(status: string):string {
    return status === 'CONCLUIDA' ? 'activity-mark activity-disabled' : 'activity-mark';
  }

  handleActivityEvent(action: string, id?: string): void {
    if (action && action !== ''){
      const activityEventData = id && id !== '' ? {action, id} : {action}
      this.activityEvent.emit(activityEventData);
    }
  }

  handleDeleteActivity(id: number, name: string): void {
    if(id !== 0 && name !== ''){
      this.deleteActivityEvent.emit({
        id,
        name
      })
    }
  }
}
