import axiosClient from '@app/api/axiosClientMock';
import { AREAS_URL } from '@app/constants';
import { AreaInterface } from '@app/models';
import { GetParams } from '@app/models/common';
import { authorizedHeader } from '@app/utils';

const areasApi = {
  getAll(params?: GetParams): Promise<AreaInterface[]> {
    const url = AREAS_URL;
    return axiosClient.get(url, {
      params,
      headers: authorizedHeader(),
    });
  },

  getById(id: string): Promise<AreaInterface> {
    const url = `${AREAS_URL}/${id}`;
    return axiosClient.get(url, {
      headers: authorizedHeader(),
    });
  },

  add(data: AreaInterface): Promise<AreaInterface> {
    const url = AREAS_URL;
    return axiosClient.post(url, data, {
      headers: authorizedHeader(),
    });
  },
  update(data: AreaInterface, id: string): Promise<AreaInterface> {
    const url = `${AREAS_URL}/${id}`;
    return axiosClient.put(url, data, {
      headers: authorizedHeader(),
    });
  },
  remove(id: string): Promise<AreaInterface> {
    const url = `${AREAS_URL}/${id}`;
    return axiosClient.delete(url, {
      headers: authorizedHeader(),
    });
  },
};

export default areasApi;
