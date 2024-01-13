import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from '../models/activity';

const baseUrl = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  getActivities(activityGroupId: number) {
    return this.http.get<Activity[]>(
      `${baseUrl}groups/${activityGroupId}/activities`
    );
  }

  getNumberOfLateActivities() {
    return this.http.get<number>(
      `${baseUrl}activities/late`
    );
  }

  getActivitiesByTitle(title: string) {
    return this.http.get<Activity[]>(`${baseUrl}activities/filter`, {
      params: new HttpParams().set('title', title),
    });
  }

  saveActivity(activityGroupId: number, activity: Activity) {
    return this.http.post<Activity>(
      `${baseUrl}groups/${activityGroupId}/activities`,
      activity
    );
  }

  updateActivity(activityGroupId: number, activity: Activity) {
    return this.http.put<void>(
      `${baseUrl}groups/${activityGroupId}/activities`,
      activity
    );
  }

  deleteActivity(activityId: number) {
    return this.http.delete<void>(`${baseUrl}activities/${activityId}`);
  }

  deleteAllActivities(activityGroupId: number) {
    return this.http.delete<void>(
      `${baseUrl}groups/${activityGroupId}/activities`
    );
  }
}
