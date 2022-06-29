import axiosClient from '@app/api/axiosClient';
import { ORDERS_URL } from '@app/constants';
import { GetParams } from '@app/models/common';
import { OrderInterface, OrderPostData } from '@app/models';
import { authorizedHeader } from '@app/utils';

const customersApi = {
  getAll(params?: GetParams): Promise<OrderInterface[]> {
    const url = ORDERS_URL;
    return axiosClient.get(url, { params, headers: authorizedHeader() });
  },

  getById(id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.get(url, { headers: authorizedHeader() });
  },

  add(data: OrderPostData): Promise<OrderInterface> {
    const url = ORDERS_URL;
    return axiosClient.post(url, data, { headers: authorizedHeader() });
  },
  update(data: OrderPostData, id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.put(url, data, { headers: authorizedHeader() });
  },
  remove(id: string): Promise<OrderInterface> {
    const url = `${ORDERS_URL}/${id}`;
    return axiosClient.delete(url, { headers: authorizedHeader() });
  },
};

export default customersApi;
