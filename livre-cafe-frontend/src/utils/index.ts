import IMAGES from '@app/assets/images';
import { CartItemInterface, CartStateInterface } from '@app/context/Store';
import {
  OrderPostData,
  ProductType,
  ReservationInterface,
  VoucherInterface,
} from '@app/models';
import { ErrorResponse } from '@app/models/common';
import { CustomerGender, RankType } from '@app/models/customer.interface';
import { ReservationPostData } from '@app/models/reservation.interface';
import { MenuItem } from '@mui/material';
import { AxiosError } from 'axios';
import moment, { duration, Moment } from 'moment';

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

export const getCartTotal = (state: CartStateInterface) => {
  return (
    state.cart.cartItems.reduce((a, c) => a + Number(c.price) * c.quantity, 0) +
    (state.reservation?.duration || 0) *
      (state.reservation?.area?.costPerHour || 0)
  );
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
  const { cart, vouchers, reservation } = state;
  const voucherCost = vouchers ? getVouchersTotal(vouchers) : 0;
  return getCartTotal(state) - voucherCost < 0
    ? 0
    : getCartTotal(state) - voucherCost;
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

export const roundupHour = (time: Moment) => {
  return time.minute()
    ? time.add(1, 'hour').startOf('hour')
    : time.startOf('hour');
};

export const renderTimeSlots = (date: Date) => {
  const today = new Date();
  if (today.getDate() === date.getDate()) {
    const startTime = roundupHour(moment(today));
    const remainingHours = 24 - startTime.hours();
    return Array(remainingHours)
      .fill(1)
      .map((_val, index) => {
        const time = roundupHour(moment(today));
        const value = time.add(index, 'hour').format('HH:mm').toString();
        return value;
      });
  }
  return Array(24)
    .fill(1)
    .map((_val, index) => {
      const time = moment(moment(date).toDate().setHours(0));
      time.startOf('hour');
      const value = time.add(index, 'hour').format('HH:mm');
      return value;
    });
};
export const generateReservationData = (data?: ReservationPostData) => {
  if (!data) return undefined;
  const startTime = new Date(data.date);
  console.log(data);
  const momentTime = moment(data.time, 'HH:mm');
  startTime.setHours(momentTime.hours());
  startTime.setMinutes(momentTime.minutes());
  console.log(startTime.toDateString);
  return {
    ...data,
    area: data.area?._id,
    startTime,
  };
};

export const getEndTime = (reservation?: ReservationInterface) => {
  if (!reservation) return 'Invalid Reservation';
  const endTime = moment(reservation.startTime).add(
    reservation.duration,
    'hours',
  );
  return endTime.format('hh:mm A');
};
