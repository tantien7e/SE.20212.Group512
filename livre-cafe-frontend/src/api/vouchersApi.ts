import axiosClient from '@app/api/axiosClient';
import { VOUCHERS_URL } from '@app/constants';
import { GetParams } from '@app/models/common';
import {
  VoucherInterface,
  VoucherPostData,
} from '@app/models/voucher.interface';
import { authorizedHeader } from '@app/utils';

const vouchersApi = {
  getAll(params?: GetParams): Promise<VoucherInterface[]> {
    const url = VOUCHERS_URL;
    return axiosClient.get(url, { params, headers: authorizedHeader() });
  },

  getById(id: string): Promise<VoucherInterface> {
    const url = `${VOUCHERS_URL}/${id}`;
    return axiosClient.get(url, { headers: authorizedHeader() });
  },

  add(data: VoucherPostData): Promise<VoucherInterface> {
    const url = VOUCHERS_URL;
    return axiosClient.post(url, data, { headers: authorizedHeader() });
  },
  update(data: VoucherInterface, id: string): Promise<VoucherInterface> {
    const url = `${VOUCHERS_URL}/${id}`;
    console.log(url)
    return axiosClient.put(url, data, { headers: authorizedHeader() });
  },
  remove(id: string): Promise<VoucherInterface> {
    const url = `${VOUCHERS_URL}/${id}`;
    return axiosClient.delete(url, { headers: authorizedHeader() });
  },
};

export default vouchersApi;
