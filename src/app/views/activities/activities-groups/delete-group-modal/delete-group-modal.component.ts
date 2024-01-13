import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  inject,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityGroupService } from '../../../../services/activity-group.service';
import { ActivityGroup } from '../../../../models/activity-group';
import { Activity } from '../../../../models/activity';
import { ToastrService } from 'ngx-toastr';
import { ActivityService } from '../../../../services/activity.service';

@Component({
  selector: 'app-delete-group-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'delete-group-modal.component.html',
  styleUrl: './delete-group-modal.component.css',
})
export class DeleteGroupModalComponent {
  @Input() groupId!: number;
  @Output() newActivityGroupEvent = new EventEmitter<ActivityGroup[]>();
  @Output() newActivityEvent = new EventEmitter<Activity[]>();
  private modalService = inject(NgbModal);

  constructor(
    private activityGroupService: ActivityGroupService,
    private activityService: ActivityService,
    private toastService: ToastrService
  ) {}

  deleteActivityGroup() {
    this.activityGroupService.deleteActivityGroup(this.groupId).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.toastService.success('Group successfully deleted!');
        this.getNewActivityGroup();
      },
      error: () => {
        this.toastService.error('Internal server error!');
      },
    });
  }

  deleteAllActivitiesFromGroup() {
    this.activityService.deleteAllActivities(this.groupId).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.toastService.success(
          'Activities from group successfully deleted!'
        );
        this.getNewActivityGroup();
      },
      error: () => {
        this.toastService.error('Internal server error!');
      },
    });
  }

  getNewActivityGroup() {
    this.activityGroupService.getActivitiesGroups().subscribe((res) => {
      this.newActivityGroupEvent.emit(res);
    });
  }

  getNewActivities() {
    this.activityService.getActivities(this.groupId).subscribe((res) => {
      this.newActivityEvent.emit(res);
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
