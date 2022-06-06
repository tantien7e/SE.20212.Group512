import axiosClient from '@app/api/axiosClient';
import { DRINKS_URL } from '@app/constants';
import { DrinkInterface } from '@app/models';
import { GetParams } from '@app/models/common';

const drinksApi = {
  getAll(params?: GetParams): Promise<DrinkInterface[]> {
    const url = DRINKS_URL;
    return axiosClient.get(url, { params });
  },

  getById(id: string): Promise<DrinkInterface> {
    const url = `${DRINKS_URL}/${id}`;
    return axiosClient.get(url);
  },

  add(data: DrinkInterface): Promise<DrinkInterface> {
    const url = DRINKS_URL;
    return axiosClient.post(url, data);
  },
  update(data: DrinkInterface, id: string): Promise<DrinkInterface> {
    const url = `${DRINKS_URL}/${id}`;
    return axiosClient.put(url, data);
  },
  remove(id: string): Promise<DrinkInterface> {
    const url = `${DRINKS_URL}/${id}`;
    return axiosClient.delete(url);
  },
};

export default drinksApi;
