import { CommonModule, formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  inject,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Activity } from '../../../../models/activity';
import { ActivityService } from '../../../../services/activity.service';
import { CursorPointerDirective } from '../../../../directives/cursor-pointer.directive';
import { ActivitySearchService } from '../../../../services/activity-search.service';

@Component({
  selector: 'app-update-delete-activity-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CursorPointerDirective],
  templateUrl: './update-delete-activity-modal.component.html',
  styleUrl: './update-delete-activity-modal.component.css',
})
export class UpdateDeleteActivityModalComponent implements OnInit {
  @Input() activity!: Activity;
  @Input() activityGroupId!: number;
  @Output() newActivityEvent = new EventEmitter<Activity[]>();
  activityForm!: FormGroup;
  private modalService = inject(NgbModal);

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private activitySearchService: ActivitySearchService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      deadline: ['', Validators.required],
      status: [this.activity.status == 'done' ? true : false]
    });
  }

  get title() {
    return this.activityForm.get('title')!;
  }

  get deadline() {
    return this.activityForm.get('deadline')!;
  }

  get status() {
    return this.activityForm.get('status')!;
  }

  updateActivity() {
    if (this.activityForm.valid) {
      const deadlineDate = new Date(this.deadline.value);
      const status = this.defineActivityStatus(deadlineDate);

      this.activityService
        .updateActivity(this.activityGroupId, {
          ...this.activityForm.value,
          id: this.activity.id,
          deadline: deadlineDate,
          status,
        })
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.toastService.success('Activity successfully updated!');
            this.getNewActivity();
          },
          error: (exception) => {
            this.toastService.error(exception.error.message);
          },
        });
    } else {
      Object.keys(this.activityForm.controls).forEach((key) => {
        const control = this.activityForm.controls[key];
        if (!control.valid) {
          control.markAsDirty();
        }
      });
    }
  }

  deleteActivity() {
    this.activityService.deleteActivity(this.activity.id).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.toastService.success('Activity successfully deleted!');
        this.getNewActivity();
      },
      error: () => {
        this.toastService.error('Internal server error!');
      },
    });
  }

  getNewActivity() {
    this.activityService
      .getActivities(this.activityGroupId)
      .subscribe((res) => {
        this.newActivityEvent.emit(res);
        this.activitySearchService.setData(this.activityGroupId);
      });
  }

  defineActivityStatus(deadline: Date) {
    if(this.status.value) {
      return 'done';
    } else if(deadline < new Date()) {
      return 'late';
    } else {
      return 'in progress';
    }
  }

  open(content: TemplateRef<any>) {
    this.activityForm.patchValue({
      title: this.activity.title,
      deadline: formatDate(this.activity.deadline, 'yyyy-MM-dd', 'en'),
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
