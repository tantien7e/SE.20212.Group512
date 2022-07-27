import axiosClient from '@app/api/axiosClient';
import { RESERVATIONS_URL } from '@app/constants';
import { ReservationInterface } from '@app/models';
import { GetParams } from '@app/models/common';
import { authorizedHeader } from '@app/utils';

const reservationsApi = {
  getAll(params?: GetParams): Promise<ReservationInterface[]> {
    const url = RESERVATIONS_URL;
    return axiosClient.get(url, {
      params,
      headers: authorizedHeader(),
    });
  },

  getById(id: string): Promise<ReservationInterface> {
    const url = `${RESERVATIONS_URL}/${id}`;
    return axiosClient.get(url, {
      headers: authorizedHeader(),
    });
  },

  add(data: ReservationInterface): Promise<ReservationInterface> {
    const url = RESERVATIONS_URL;
    return axiosClient.post(url, data, {
      headers: authorizedHeader(),
    });
  },
  update(
    data: ReservationInterface,
    id: string,
  ): Promise<ReservationInterface> {
    const url = `${RESERVATIONS_URL}/${id}`;
    return axiosClient.put(url, data, {
      headers: authorizedHeader(),
    });
  },
  remove(id: string): Promise<ReservationInterface> {
    const url = `${RESERVATIONS_URL}/${id}`;
    return axiosClient.delete(url, {
      headers: authorizedHeader(),
    });
  },
};

export default reservationsApi;
