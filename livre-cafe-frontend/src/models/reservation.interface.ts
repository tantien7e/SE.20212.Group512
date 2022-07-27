import { CustomerInterface, AreaInterface, OrderInterface } from '@app/models';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SEATED = 'seated',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ReservationStatusIndex {
  PENDING = 1,
  CONFIRMED = 2,
  SEATED = 3,
  COMPLETED = 4,
  CANCELLED = 5,
}

export interface ReservationPostData {
  area: AreaInterface;
  duration: number;
  date: Date;
  time: string;
  additionalRequirements?: string;
  customer?: CustomerInterface;
}

export interface ReservationInterface {
  _id: string;
  startTime: Date;
  duration: number;
  area: AreaInterface;
  status: ReservationStatus;
  order: OrderInterface;
  additionalRequirements?: string;
}
