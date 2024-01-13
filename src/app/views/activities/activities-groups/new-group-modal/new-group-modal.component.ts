import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
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
import { ActivityGroupService } from '../../../../services/activity-group.service';
import { ToastrService } from 'ngx-toastr';
import { ActivityGroup } from '../../../../models/activity-group';

@Component({
  selector: 'app-new-group-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-group-modal.component.html',
  styleUrl: './new-group-modal.component.css',
})
export class NewGroupModalComponent implements OnInit {
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
  }

  initForm() {
    this.activityGroupForm = this.fb.group({
      title: ['', [Validators.required]],
      workInProgress: ['', [Validators.required, Validators.min(1)]],
    });
  }

  saveActivityGroup() {
    if (this.activityGroupForm.valid) {
      this.activityGroupService
        .saveActivityGroup(this.activityGroupForm.value)
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.toastService.success('Group successfully created!');
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
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => this.activityGroupForm.reset(),
        () => this.activityGroupForm.reset()
      );
  }
}
