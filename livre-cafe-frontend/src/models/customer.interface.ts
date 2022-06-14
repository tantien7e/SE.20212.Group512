import { OrderInterface } from '@app/models/order.interface';

export enum CustomerGender {
  MALE = 'male',
  FEMALE = 'female',
  NA = 'N/A',
}

export enum RankType {
  DIAMOND = 'DIAMOND',
  PLATINUM = 'PLATINUM',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
}

export enum RankIndex {
  DIAMOND = 1,
  PLATINUM = 2,
  GOLD = 3,
  SILVER = 4,
}

export const CUSTOMER = 'CUSTOMER';
export interface CustomerInterface {
  firstName: string;
  lastName: string;
  gender: CustomerGender;
  phone: string;
  email: string;
  ranking: RankType;
  points: number;
  _id: string;
  orders: OrderInterface[];
  id: string;
}
