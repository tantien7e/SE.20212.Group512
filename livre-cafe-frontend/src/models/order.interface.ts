import { CartItemInterface } from '@app/context/Store';
import { CustomerInterface } from '@app/models/customer.interface';
import { ProductInterface } from '@app/models/product.interface';
import { VoucherInterface } from '@app/models/voucher.interface';

export enum OrderStatusType {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProductType {
  DRINK = 'drinks',
  BOOK = 'books',
}
export interface OrderInterface {
  itemsOrdered: ItemOrdered[];
  status: OrderStatusType;
  customer?: CustomerInterface;
  vouchers?: VoucherInterface[];
  bookedAt: Date;
  id?: string;
  _id?: string;
  totalCost: number;
  createdAt?: Date;
}

export interface ItemOrdered {
  product: ProductInterface;
  quantity: number;
  additionalRequirements: string;
  productType: ProductType;
}

export interface OrderPostData
  extends Omit<OrderInterface, 'itemsOrdered' | 'customer'> {
  itemsOrdered: {
    product: string;
    quantity: number;
    additionalRequirements: string;
    productType: ProductType;
  }[];
  customer?: string | null;
}
