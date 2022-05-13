import { customError } from "@app/redux-toolkit/features/api/api.interface";

export const getError = (error: customError) => {
  return (error.data && error.data.message) || error.message;
};
