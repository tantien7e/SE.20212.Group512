import { CustomerInterface } from '@app/models';
import { AreaInterface } from '@app/models/area.interface';

export interface ReservationPostData {
  area: AreaInterface;
  duration: number;
  date: Date;
  time: string;
  additionalRequirement?: string;
  customer?: CustomerInterface;
}
