import axiosClient from '@app/api/axiosClient';
import { CUSTOMERS_URL } from '@app/constants';
import { GetParams } from '@app/models/common';
import {
  CustomerInterface,
  CustomerPostData,
} from '@app/models/customer.interface';
import { authorizedHeader } from '@app/utils';

const customersApi = {
  getAll(params?: GetParams): Promise<CustomerInterface[]> {
    const url = CUSTOMERS_URL;
    return axiosClient.get(url, { params, headers: authorizedHeader() });
  },

  getById(id: string): Promise<CustomerInterface> {
    const url = `${CUSTOMERS_URL}/${id}`;
    return axiosClient.get(url, { headers: authorizedHeader() });
  },

  add(data: CustomerPostData): Promise<CustomerInterface> {
    const url = CUSTOMERS_URL;
    return axiosClient.post(url, data, { headers: authorizedHeader() });
  },
  update(data: CustomerInterface, id: string): Promise<CustomerInterface> {
    const url = `${CUSTOMERS_URL}/${id}`;
    return axiosClient.put(url, data, { headers: authorizedHeader() });
  },
  remove(id: string): Promise<CustomerInterface> {
    const url = `${CUSTOMERS_URL}/${id}`;
    return axiosClient.delete(url, { headers: authorizedHeader() });
  },
};

export default customersApi;
