// f298aa2d-cf5b-40dd-8dba-081285b7a489
import { BookInterface, DrinkInterface } from "@app/types/product.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DOGS_API_KEY = "f298aa2d-cf5b-40dd-8dba-081285b7a489";

export const drinkApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders(headers) {
      headers.set("x-api-key", DOGS_API_KEY);
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      fetchDrinks: builder.query<DrinkInterface[], number | void>({
        query(limit = 10) {
          return `drinks?limit=${limit}`;
        },
      }),
    };
  },
});

export const { useFetchDrinksQuery } = drinkApi;
