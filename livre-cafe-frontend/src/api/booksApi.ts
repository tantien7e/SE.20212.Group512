import axiosClient from '@app/api/axiosClient';
import { BOOKS_URL } from '@app/constants';
import { BookInterface } from '@app/models';
import { GetParams } from '@app/models/common';

const booksApi = {
  getAll(params?: GetParams): Promise<BookInterface[]> {
    const url = BOOKS_URL;
    return axiosClient.get(url, { params });
  },

  getById(id: string): Promise<BookInterface> {
    const url = `${BOOKS_URL}/${id}`;
    return axiosClient.get(url);
  },

  add(data: BookInterface): Promise<BookInterface> {
    const url = BOOKS_URL;
    return axiosClient.post(url, data);
  },
  update(data: BookInterface, id: string): Promise<BookInterface> {
    const url = `${BOOKS_URL}/${id}`;
    return axiosClient.put(url, data);
  },
  remove(id: string): Promise<BookInterface> {
    const url = `${BOOKS_URL}/${id}`;
    return axiosClient.delete(url);
  },
};

export default booksApi;
