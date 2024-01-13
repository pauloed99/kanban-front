import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ActivitiesGroupsComponent } from './activities-groups/activities-groups.component';
import { Activity } from '../../models/activity';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ActivitiesGroupsComponent
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
})
export class ActivitiesComponent { 
}
