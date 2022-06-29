import axiosClient from '@app/api/axiosClient';
import { DRINKS_URL } from '@app/constants';
import { DrinkInterface } from '@app/models';
import { GetParams } from '@app/models/common';
import { authorizedHeader } from '@app/utils';

const drinksApi = {
  getAll(params?: GetParams): Promise<DrinkInterface[]> {
    const url = DRINKS_URL;
    return axiosClient.get(url, { params, headers: authorizedHeader() });
  },

  getById(id: string): Promise<DrinkInterface> {
    const url = `${DRINKS_URL}/${id}`;
    return axiosClient.get(url, { headers: authorizedHeader() });
  },

  add(data: DrinkInterface): Promise<DrinkInterface> {
    const url = DRINKS_URL;
    return axiosClient.post(url, data, { headers: authorizedHeader() });
  },
  update(data: DrinkInterface, id: string): Promise<DrinkInterface> {
    const url = `${DRINKS_URL}/${id}`;
    return axiosClient.put(url, data, { headers: authorizedHeader() });
  },
  remove(id: string): Promise<DrinkInterface> {
    const url = `${DRINKS_URL}/${id}`;
    return axiosClient.delete(url, { headers: authorizedHeader() });
  },
};

export default drinksApi;
