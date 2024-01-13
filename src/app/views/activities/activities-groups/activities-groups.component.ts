import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CursorPointerDirective } from '../../../directives/cursor-pointer.directive';
import { ActivityGroup } from '../../../models/activity-group';
import { ActivityGroupService } from '../../../services/activity-group.service';
import { ActivityGroupComponent } from './activity-group/activity-group.component';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';

@Component({
  selector: 'app-activities-groups',
  standalone: true,
  imports: [
    CommonModule,
    CursorPointerDirective,
    NewGroupModalComponent,
    ActivityGroupComponent,
  ],
  templateUrl: 'activities-groups.component.html',
  styleUrl: './activities-groups.component.css',
})
export class ActivitiesGroupsComponent implements OnInit {
  activitiesGroups: ActivityGroup[] = [];
  activitiesGroupsIds: string[] = [];

  constructor(private activityGroupService: ActivityGroupService) {}

  ngOnInit(): void {
    this.activityGroupService
      .getActivitiesGroups()
      .subscribe((res) => {
        this.activitiesGroups = res;
        this.activitiesGroupsIds = this.activitiesGroups.map((activityGroup) => activityGroup.id.toString());
      });
  }

  getNewActivityGroup(activitiesGroups: ActivityGroup[]) {
    this.activitiesGroups = activitiesGroups;
  }
}
