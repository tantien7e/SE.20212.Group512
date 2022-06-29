import { RootState } from '@app/app/store';
import { StaffResponse } from '@app/models/user.interface';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  loading: boolean;
  message: string;
  staff?: StaffResponse;
  outletPin: string;
  codeName: string;
  error: string;
  isVerified?: boolean;
  verifyLoading: boolean;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface VerifyResponse {
  success: boolean;
}

export interface LoginResponse {
  token: string;
  staff: StaffResponse;
  success: boolean;
}

export interface VerifyPayload {
  callback: (success: boolean) => void;
}

const initialState: IInitialState = {
  loading: false,
  message: '',
  staff: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '')
    : '',
  outletPin: '',
  codeName: '',
  error: '',
  isVerified: false,
  verifyLoading: false,
};

const authenticationSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    submitLogin(state, action: PayloadAction<LoginBody>) {
      state.error = '';
      state.loading = true;
    },
    submitLoginSucceeded(state, action: PayloadAction<LoginResponse>) {
      state.loading = false;
      toastInformSuccess('Logged in!');
      localStorage.setItem('user', JSON.stringify(action.payload.staff));
      state.staff = action.payload.staff;
      state.isVerified = true;
    },
    submitLoginFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      toastError(action.payload || "Something's wrong!");
      state.isVerified = false;
    },
    verify(state, action: PayloadAction<VerifyPayload>) {
      state.verifyLoading = true;
    },

    verifySucceeded(state) {
      state.isVerified = true;
      state.verifyLoading = false;
    },

    verifyFailed(state, action: PayloadAction<string>) {
      state.isVerified = false;
      state.verifyLoading = false;
      toastError(action.payload || 'Not authorized');
    },
    signOut(state) {
      state.isVerified = false;
      state.staff = undefined;
    },
  },
});

export const {
  submitLogin,
  submitLoginFailed,
  submitLoginSucceeded,
  verify,
  verifySucceeded,
  verifyFailed,
  signOut,
} = authenticationSlice.actions;

export const selectUser = (state: RootState) => state.authentication.staff;
export const selectAuthLoading = (state: RootState) =>
  state.authentication.loading;
export const selectVerifyLoading = (state: RootState) =>
  state.authentication.verifyLoading;
export const selectVerify = (state: RootState) =>
  state.authentication.isVerified;

const authenticationReducer = authenticationSlice.reducer;
export default authenticationReducer;
