import axiosClient from '@app/api/axiosClient';
import { BOOKS_URL } from '@app/constants';
import { BookInterface } from '@app/models';
import { GetParams } from '@app/models/common';
import { authorizedHeader } from '@app/utils';

const booksApi = {
  getAll(params?: GetParams): Promise<BookInterface[]> {
    const url = BOOKS_URL;
    return axiosClient.get(url, {
      params,
      headers: authorizedHeader(),
    });
  },

  getById(id: string): Promise<BookInterface> {
    const url = `${BOOKS_URL}/${id}`;
    return axiosClient.get(url, {
      headers: authorizedHeader(),
    });
  },

  add(data: BookInterface): Promise<BookInterface> {
    const url = BOOKS_URL;
    return axiosClient.post(url, data, {
      headers: authorizedHeader(),
    });
  },
  update(data: BookInterface, id: string): Promise<BookInterface> {
    const url = `${BOOKS_URL}/${id}`;
    return axiosClient.put(url, data, {
      headers: authorizedHeader(),
    });
  },
  remove(id: string): Promise<BookInterface> {
    const url = `${BOOKS_URL}/${id}`;
    return axiosClient.delete(url, {
      headers: authorizedHeader(),
    });
  },
};

export default booksApi;
