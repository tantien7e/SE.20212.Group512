// f298aa2d-cf5b-40dd-8dba-081285b7a489
import { BookInterface } from '@app/models/product.interface';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const verifyApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/auth/',
    prepareHeaders(headers) {
      const token = localStorage.getItem('token');
      headers.set('Authorization', token || '');
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      verify: builder.query<BookInterface[], number | void>({
        query() {
          return `verify-token`;
        },
      }),
    };
  },
});

export const { useVerifyQuery } = verifyApi;
