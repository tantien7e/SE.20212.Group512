import { ReservationInterface } from '@app/models/reservation.interface';

export enum AreaStatus {
  FREE = 'free',
  OCCUPIED = 'occupied',
}
export interface AreaInterface {
  // id: string;
  width: number;
  height: number;
  y: number;
  x: number;
  rotate: number;
  backgroundImage: string;
  _id: string;
  name: string;
  isNotClickable?: boolean;
  costPerHour: number;
  status: AreaStatus;
  available: boolean;
  reservations?: ReservationInterface[];
  capacity?: number;
}
