import { CommonModule } from '@angular/common';
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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Activity } from '../../../../models/activity';
import { ActivityService } from '../../../../services/activity.service';

@Component({
  selector: 'app-new-activity-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-activity-modal.component.html',
  styleUrl: './new-activity-modal.component.css',
})
export class NewActivityModalComponent implements OnInit {
  @Input() groupId!: number;
  @Output() newActivityEvent = new EventEmitter<Activity[]>();
  activityForm!: FormGroup;
  private modalService = inject(NgbModal);

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  get title() {
    return this.activityForm.get('title')!;
  }

  get deadline() {
    return this.activityForm.get('deadline')!;
  }

  defineActivityStatusAccordingDeadline(deadline: Date) {
    const actualDate = new Date();

    if (deadline < actualDate) {
      return 'late';
    } else {
      return 'in progress';
    }
  }

  saveActivity() {
    if (this.activityForm.valid) {
      const deadLineDate = new Date(this.deadline.value);
      const status = this.defineActivityStatusAccordingDeadline(deadLineDate);
      this.activityService
        .saveActivity(this.groupId, {
          ...this.activityForm.value,
          deadline: deadLineDate,
          status,
        })
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.toastService.success('Activity successfully created!');
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

  getNewActivity() {
    this.activityService.getActivities(this.groupId).subscribe((res) => {
      this.newActivityEvent.emit(res);
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => this.activityForm.reset(),
        () => this.activityForm.reset()
      );
  }
}
