import axiosClient from '@app/api/axiosClient';
import { STAFFS_URL } from '@app/constants';
import { GetParams } from '@app/models/common';
import { StaffPostData, StaffResponse } from '@app/models/user.interface';
import { authorizedHeader } from '@app/utils';

const staffsApi = {
  getAll(params?: GetParams): Promise<StaffResponse[]> {
    const url = STAFFS_URL;
    return axiosClient.get(url, { params, headers: authorizedHeader() });
  },

  getById(id: string): Promise<StaffResponse> {
    const url = `${STAFFS_URL}/${id}`;
    return axiosClient.get(url, { headers: authorizedHeader() });
  },

  add(data: StaffPostData): Promise<StaffResponse> {
    const url = STAFFS_URL;
    return axiosClient.post(url, data, { headers: authorizedHeader() });
  },
  update(data: StaffResponse, id: string): Promise<StaffResponse> {
    const url = `${STAFFS_URL}/${id}`;
    return axiosClient.put(url, data, { headers: authorizedHeader() });
  },
  remove(id: string): Promise<StaffResponse> {
    const url = `${STAFFS_URL}/${id}`;
    return axiosClient.delete(url, { headers: authorizedHeader() });
  },
};

export default staffsApi;
