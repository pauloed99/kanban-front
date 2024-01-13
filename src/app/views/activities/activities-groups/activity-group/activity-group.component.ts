import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
} from '@angular/core';
import { CursorPointerDirective } from '../../../../directives/cursor-pointer.directive';
import { Activity } from '../../../../models/activity';
import { ActivityGroup } from '../../../../models/activity-group';
import { ActivityService } from '../../../../services/activity.service';
import { DeleteGroupModalComponent } from '../delete-group-modal/delete-group-modal.component';
import { EditGroupModalComponent } from '../edit-group-modal/edit-group-modal.component';
import { NewActivityModalComponent } from '../new-activity-modal/new-activity-modal.component';
import { UpdateDeleteActivityModalComponent } from '../update-delete-activity-modal/update-delete-activity-modal.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { ActivityLateService } from '../../../../services/activity-late.service';
import { ActivitySearchService } from '../../../../services/activity-search.service';

@Component({
  selector: 'app-activity-group',
  standalone: true,
  imports: [
    CommonModule,
    NewActivityModalComponent,
    EditGroupModalComponent,
    DeleteGroupModalComponent,
    UpdateDeleteActivityModalComponent,
    CursorPointerDirective,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: 'activity-group.component.html',
  styleUrl: './activity-group.component.css',
})
export class ActivityGroupComponent implements OnInit {
  @Input() activityGroup!: ActivityGroup;
  @Input() activitiesGroupsIds!: string[];
  @Output() newActivityGroupEvent = new EventEmitter<ActivityGroup[]>();
  activities: Activity[] = [];

  constructor(
    private activityService: ActivityService,
    private activityLateService: ActivityLateService,
    private activitySearchService: ActivitySearchService,
    private toastService: ToastrService
  ) {
    effect(() => {
      if(this.activityGroupIdChanged() == this.activityGroup.id) {
        this.getActivities();
      }
    })
  }

  ngOnInit(): void {
    this.getActivities();
  }

  getActivities() {
    this.activityService
      .getActivities(this.activityGroup.id)
      .subscribe((res) => {
        this.activities = res;
      });
  }

  getNewActivity(activities: Activity[]) {
    this.activities = activities;
    this.activityService
      .getNumberOfLateActivities()
      .subscribe((res) => this.activityLateService.setData(res));
  }

  getNewActivityGroup(activitiesGroups: ActivityGroup[]) {
    this.newActivityGroupEvent.emit(activitiesGroups);
    this.activityService
      .getNumberOfLateActivities()
      .subscribe((res) => this.activityLateService.setData(res));
  }

  get activityGroupIdChanged() {
    return this.activitySearchService.getData();
  }

  teste() {
    console.log(this.activityGroup.id);
  }

  drop(event: CdkDragDrop<Activity[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.activityService
        .updateActivity(this.activityGroup.id, {
          ...event.previousContainer.data[event.previousIndex],
          deadline: new Date(
            event.previousContainer.data[event.previousIndex].deadline
          ),
        })
        .subscribe({
          next: () => {
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );
            this.toastService.success(
              'Group of Activity successfully updated!'
            );
          },
          error: (exception) => {
            this.toastService.error(exception.error.message);
          },
        });
    }
  }
}
