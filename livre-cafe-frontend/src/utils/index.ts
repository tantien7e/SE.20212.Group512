import { CartItemInterface } from '@app/context/Store';
import { RankType } from '@app/models/customer.interface';

export function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
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
