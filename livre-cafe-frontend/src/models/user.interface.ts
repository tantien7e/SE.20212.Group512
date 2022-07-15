import { OrderInterface } from '@app/models/order.interface';

export interface StaffResponse {
  isManager: boolean;
  username: string;
  passcode: string;
  _id?: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  ordersHandled?: OrderInterface[];
  firstName: string;
  lastName?: string;
  accountActivated?: boolean;
}

export type StaffPostData = Omit<StaffResponse, 'username' | 'passcode'>;

export enum UserRoleIndex {
  MANAGER = 1,
  STAFF = 2,
}

export enum UserRole {
  MANAGER = 'Manager',
  STAFF = 'Staff',
}
