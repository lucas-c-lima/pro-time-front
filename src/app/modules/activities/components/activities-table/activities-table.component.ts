import { Component, Input } from '@angular/core';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';

@Component({
  selector: 'app-activities-table',
  templateUrl: './activities-table.component.html',
  styleUrls: ['./activities-table.component.scss']
})
export class ActivitiesTableComponent {
  @Input() activities: Array<GetAllActivitiesResponse> = []

  public activitySelected!: GetAllActivitiesResponse;
}
