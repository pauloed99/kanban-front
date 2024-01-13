import { ActivityGroup } from "./activity-group";

export interface Activity {
  id: number;
  title: string;
  deadline: Date;
  status: string;
  group: ActivityGroup;
}
