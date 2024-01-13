import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivitySearchService {
  private activityGroupId = signal(-1);

  setData(activitiesLate: number) {
    this.activityGroupId.set(activitiesLate);
  }

  getData() {
    return this.activityGroupId;
  }

}
