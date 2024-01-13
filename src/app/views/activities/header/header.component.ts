import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { CursorPointerDirective } from '../../../directives/cursor-pointer.directive';
import { Activity } from '../../../models/activity';
import { ActivityLateService } from '../../../services/activity-late.service';
import { ActivityService } from '../../../services/activity.service';
import { UpdateDeleteActivityModalComponent } from '../activities-groups/update-delete-activity-modal/update-delete-activity-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    CursorPointerDirective,
    NgbPopoverModule,
    MatAutocompleteModule,
    UpdateDeleteActivityModalComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  options: Activity[] = [];

  constructor(
    private activityService: ActivityService,
    private activityLateService: ActivityLateService
  ) {}

  ngOnInit(): void {
    this.activityService
      .getNumberOfLateActivities()
      .subscribe((res) => this.activityLateService.setData(res));
  }

  get numberOfActivitiesLate() {
    return this.activityLateService.getData();
  }

  handleActivityChange(event: Event) {
    const title = (event.target as HTMLInputElement).value;
    this.activityService.getActivitiesByTitle(title).subscribe((res) => {
      this.options = res;
    });
  }

  displayFn(activity: Activity) {
    return activity.title;
  }
}
