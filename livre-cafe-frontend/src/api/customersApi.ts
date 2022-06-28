import axiosClient from '@app/api/axiosClient';
import { CUSTOMERS_URL } from '@app/constants';
import { GetParams } from '@app/models/common';
import { CustomerInterface, CustomerPostData } from '@app/models/customer.interface';

const customersApi = {
  getAll(params?: GetParams): Promise<CustomerInterface[]> {
    const url = CUSTOMERS_URL;
    return axiosClient.get(url, { params });
  },

  getById(id: string): Promise<CustomerInterface> {
    const url = `${CUSTOMERS_URL}/${id}`;
    return axiosClient.get(url);
  },

  add(data: CustomerPostData): Promise<CustomerInterface> {
    const url = CUSTOMERS_URL;
    return axiosClient.post(url, data);
  },
  update(data: CustomerInterface, id: string): Promise<CustomerInterface> {
    const url = `${CUSTOMERS_URL}/${id}`;
    return axiosClient.put(url, data);
  },
  remove(id: string): Promise<CustomerInterface> {
    const url = `${CUSTOMERS_URL}/${id}`;
    return axiosClient.delete(url);
  },
};

export default customersApi;
