import axiosClient from '@app/api/axiosClientMock';
import { ORDERS_URL } from '@app/constants';
import { GetParams } from '@app/models/common';
import { OrderInterface } from '@app/models';

const customersApi = {
  getAll(params?: GetParams): Promise<OrderInterface[]> {
    const url = ORDERS_URL;
    return axiosClient.get(url, { params });
  },

  getById(id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.get(url);
  },

  add(data: OrderInterface): Promise<OrderInterface> {
    const url = ORDERS_URL;
    return axiosClient.post(url, data);
  },
  update(data: OrderInterface, id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.put(url, data);
  },
  remove(id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.delete(url);
  },
};

export default customersApi;
