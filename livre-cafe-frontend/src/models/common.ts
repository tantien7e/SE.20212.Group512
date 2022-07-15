import { CustomerInterface } from '@app/models/customer.interface';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { StaffResponse } from '@app/models/user.interface';

export interface GetParams {
  _limit?: number;
}

export type AllModel = CustomerInterface &
  BookInterface &
  DrinkInterface &
  StaffResponse;

export interface ErrorResponse {
  message: string;
  status: boolean;
}
