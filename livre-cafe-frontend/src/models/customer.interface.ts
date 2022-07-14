import { OrderInterface } from '@app/models/order.interface';

export enum CustomerGender {
  MALE = 'male',
  FEMALE = 'female',
  NA = '',
}

export enum RankType {
  DIAMOND = 'diamond',
  PLATINUM = 'platinum',
  GOLD = 'gold',
  SILVER = 'silver',
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
  rankingPoints: number;
  exchangeablePoints: number;
  _id: string;
  ordersHistory: OrderInterface[];
  // id: string;
}

export type CustomerPostData = Omit<CustomerInterface, '_id' | 'ranking'>;
