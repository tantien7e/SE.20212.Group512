export interface VoucherInterface {
  _id?: string;
  id?: string;
  voucherName: string;
  correspondingRanking: string;
  available: boolean;
  pointLoss: number;
  amount: number;
}
