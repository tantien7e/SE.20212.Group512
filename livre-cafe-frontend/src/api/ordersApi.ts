import axiosClient from '@app/api/axiosClient';
import { ORDERS_URL } from '@app/constants';
import { GetParams } from '@app/models/common';
import { OrderInterface, OrderPostData } from '@app/models';

const customersApi = {
  getAll(params?: GetParams): Promise<OrderInterface[]> {
    const url = ORDERS_URL;
    return axiosClient.get(url, { params });
  },

  getById(id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.get(url);
  },

  add(data: OrderPostData): Promise<OrderInterface> {
    const url = ORDERS_URL;
    return axiosClient.post(url, data);
  },
  update(data: OrderInterface, id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.put(url, { ...data, customer: data._id });
  },
  remove(id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.delete(url);
  },
};

export default customersApi;
