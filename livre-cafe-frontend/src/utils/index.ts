import IMAGES from '@app/assets/images';
import { CartItemInterface, CartStateInterface } from '@app/context/Store';
import { OrderPostData, ProductType, VoucherInterface } from '@app/models';
import { ErrorResponse } from '@app/models/common';
import { CustomerGender, RankType } from '@app/models/customer.interface';
import { AxiosError } from 'axios';

export function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  if (!array) return [];
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
export const round2 = (num: number): string => {
  return (Math.round(num * 100 + Number.EPSILON) / 100).toFixed(2);
};

export const numberWithCommas = (x: number | string): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const numberWithCommasRound2 = (x: number): string =>
  numberWithCommas(round2(x));

export const getCartTotal = (items: CartItemInterface[]) => {
  return items.reduce((a, c) => a + Number(c.price) * c.quantity, 0);
};

export const getVouchersTotal = (items: VoucherInterface[]) => {
  return items.reduce((a, c) => a + Number(c.discount), 0);
};

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
export const genRanking = (points: number) => {
  if (points > 700) return RankType.DIAMOND;
  if (points > 500) return RankType.PLATINUM;
  if (points > 100) return RankType.GOLD;
  return RankType.SILVER;
};

export const getSalutation = (gender: CustomerGender) => {
  switch (gender) {
    case CustomerGender.MALE:
      return 'Mr.';
    case CustomerGender.FEMALE:
      return 'Ms.';
    default:
      return '';
  }
};

export const standardize_color = (str: string) => {
  var ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return '#000000';
  ctx.fillStyle = str;
  return ctx?.fillStyle;
};
export const getBackgroundColor = (colorString: string) => {
  const hexColor = standardize_color(colorString);
  return hexColor + '50';
};

export const genAvatarImage = (gender: CustomerGender) => {
  switch (gender) {
    case CustomerGender.MALE:
      return IMAGES.malePic;
    case CustomerGender.FEMALE:
      return IMAGES.femalePic;
    case CustomerGender.NA:
      return IMAGES.naPic;
    default:
      return IMAGES.naPic;
  }
};

export const getTotalCost = (state: CartStateInterface) => {
  const { cart, vouchers } = state;
  const voucherCost = vouchers ? getVouchersTotal(vouchers) : 0;
  return getCartTotal(cart.cartItems) - voucherCost < 0
    ? 0
    : getCartTotal(cart.cartItems) - voucherCost;
};

export const genOrderPostItems = (
  cartItems: CartItemInterface[],
): OrderPostData['itemsOrdered'] => {
  return cartItems.map((item) => ({
    product: item._id,
    quantity: item.quantity,
    additionalRequirements: item.additionalRequirements,
    productType: item.title ? ProductType.BOOK : ProductType.DRINK,
  }));
};

export const authorizedHeader = () => {
  const token = localStorage.getItem('token') || '';
  return {
    Authorization: `${token}`,
    'Content-Type': 'application/json',
  };
};

export const getRankColor = (rank: RankType) => {
  switch (rank) {
    case RankType.DIAMOND:
      return 'info';
    case RankType.PLATINUM:
      return 'success';
    case RankType.GOLD:
      return 'warning';
    case RankType.SILVER:
      return 'default';
    default:
      return 'default';
  }
};

export const getErrorMessage = (error: AxiosError) => {
  return error.response
    ? (error.response.data as ErrorResponse).message
    : error.message;
};
