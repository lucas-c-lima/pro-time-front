import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityEvent } from 'src/app/models/enums/activities/ActivityEvent';
import { EventAction } from 'src/app/models/interface/activities/event/EventAction';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';

@Component({
  selector: 'app-activities-table',
  templateUrl: './activities-table.component.html',
  styleUrls: ['./activities-table.component.scss']
})
export class ActivitiesTableComponent {
  @Input() activities: Array<GetAllActivitiesResponse> = []
  @Output() activityEvent = new EventEmitter<EventAction>();

  public activitySelected!: GetAllActivitiesResponse;
  public addActivityEvent = ActivityEvent.ADD_ACTIVITY_EVENT;
  public editActivityEvent = ActivityEvent.EDIT_ACTIVITY_EVENT;
  public finishActivityEvent = ActivityEvent.FINISH_ACTIVITY_EVENT;

  handleActivityEvent(action: string, id?: string): void {
    if (action && action !== ''){
      const activityEventData = id && id !== '' ? {action, id} : {action}
      this.activityEvent.emit(activityEventData);
    }
  }

}
