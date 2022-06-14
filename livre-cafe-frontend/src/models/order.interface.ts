import { CartItemInterface } from '@app/context/Store';
import { CustomerInterface } from '@app/models/customer.interface';

export enum OrderStatusType {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderInterface {
  items: CartItemInterface[];
  status: OrderStatusType;
  customer: CustomerInterface | 'Guest';
  bookedAt: Date;
  id: string;
  _id: string;
}
