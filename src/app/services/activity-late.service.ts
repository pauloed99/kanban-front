import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityLateService {
  private activitiesLate = signal(0);

  setData(activitiesLate: number) {
    this.activitiesLate.set(activitiesLate);
  }

  getData() {
    return this.activitiesLate;
  }
}
