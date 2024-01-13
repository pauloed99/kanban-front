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
import { ActivityGroup } from '../../../../models/activity-group';
import { ActivityGroupService } from '../../../../services/activity-group.service';

@Component({
  selector: 'app-edit-group-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-group-modal.component.html',
  styleUrl: './edit-group-modal.component.css',
})
export class EditGroupModalComponent implements OnInit {
  @Input() activityGroup!: ActivityGroup;
  @Output() newActivityGroupEvent = new EventEmitter<ActivityGroup[]>();
  activityGroupForm!: FormGroup;
  private modalService = inject(NgbModal);

  get title() {
    return this.activityGroupForm.get('title')!;
  }

  get workInProgress() {
    return this.activityGroupForm.get('workInProgress')!;
  }

  constructor(
    private fb: FormBuilder,
    private activityGroupService: ActivityGroupService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initInputs();
  }

  initForm() {
    this.activityGroupForm = this.fb.group({
      title: ['', [Validators.required]],
      workInProgress: ['', [Validators.required, Validators.min(1)]],
    });
  }

  initInputs() {
    this.activityGroupForm.patchValue({
      title: this.activityGroup.title,
      workInProgress: this.activityGroup.workInProgress,
    });
  }

  updateActivityGroup() {
    if (this.activityGroupForm.valid) {
      this.activityGroupService
        .updateActivityGroup({
          ...this.activityGroupForm.value,
          id: this.activityGroup.id,
        })
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.toastService.success('Group successfully updated!');
            this.getNewActivityGroup();
          },
          error: () => {
            this.toastService.error('Internal server error!');
          },
        });
    } else {
      Object.keys(this.activityGroupForm.controls).forEach((key) => {
        const control = this.activityGroupForm.controls[key];
        if (!control.valid) {
          control.markAsDirty();
        }
      });
    }
  }

  getNewActivityGroup() {
    this.activityGroupService.getActivitiesGroups().subscribe((res) => {
      this.newActivityGroupEvent.emit(res);
    });
  }

  open(content: TemplateRef<any>) {
    this.activityGroupForm.patchValue({
      title: this.activityGroup.title,
      workInProgress: this.activityGroup.workInProgress,
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
