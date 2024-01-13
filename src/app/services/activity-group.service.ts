import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityGroup } from '../models/activity-group';

const baseUrl = 'http://localhost:8080/groups';

@Injectable({
  providedIn: 'root'
})
export class ActivityGroupService {

  constructor(private http: HttpClient) { }

  getActivitiesGroups() {
    return this.http.get<ActivityGroup[]>(baseUrl);
  }

  saveActivityGroup(activityGroup: ActivityGroup) {
    return this.http.post<ActivityGroup>(baseUrl, activityGroup);
  }

  updateActivityGroup(activityGroup: ActivityGroup) {
    return this.http.put<void>(baseUrl, activityGroup);
  }

  deleteActivityGroup(id: number) {
    return this.http.delete<void>(`${baseUrl}/${id}`);
  }
}
