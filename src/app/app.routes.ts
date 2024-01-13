import { Routes } from '@angular/router';
import { ActivitiesComponent } from './views/activities/activities.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'activities',
    pathMatch: 'full'
  },
  {
    path: 'activities',
    component: ActivitiesComponent
  }
];
