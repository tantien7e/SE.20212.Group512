import axiosClient from '@app/api/axiosClient';
import { SNACKS_URL } from '@app/constants';
import { SnackInterface } from '@app/models';
import { GetParams } from '@app/models/common';
import { authorizedHeader } from '@app/utils';

const snacksApi = {
  getAll(params?: GetParams): Promise<SnackInterface[]> {
    const url = SNACKS_URL;
    return axiosClient.get(url, { params, headers: authorizedHeader() });
  },

  getById(id: string): Promise<SnackInterface> {
    const url = `${SNACKS_URL}/${id}`;
    return axiosClient.get(url, { headers: authorizedHeader() });
  },

  add(data: SnackInterface): Promise<SnackInterface> {
    const url = SNACKS_URL;
    return axiosClient.post(url, data, { headers: authorizedHeader() });
  },
  update(data: SnackInterface, id: string): Promise<SnackInterface> {
    const url = `${SNACKS_URL}/${id}`;
    return axiosClient.put(url, data, { headers: authorizedHeader() });
  },
  remove(id: string): Promise<SnackInterface> {
    const url = `${SNACKS_URL}/${id}`;
    return axiosClient.delete(url, { headers: authorizedHeader() });
  },
};

export default snacksApi;
