import { toast } from 'react-toastify';
import React from 'react';
import ToastSuccess from './Toast/ToastSuccess';

export const toastWarning = (message: string): null => {
  toast.warn(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  return null;
};

export const toastSuccess = (message: string): null => {
  toast.success(<ToastSuccess message={message} />, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  return null;
};

export const toastInfo = (message: string): null => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  return null;
};

export const toastError = (message: string): null => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    icon: false,
  });
  return null;
};

export const toastInformSuccess = (
  message: string,
  positions?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left',
): null => {
  toast.success(message, {
    icon: false,
    position: positions || 'top-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    className: 'styled-success-on-switch-status',
    closeButton: true,
  });
  return null;
};

export const toastInformSuccessAllowUndo = (
  message: string,
  handleUndo: () => void,
  positions?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left',
): null => {
  toast.success(
    <span>
      {message}{' '}
      <span
        style={{ textDecoration: 'underline' }}
        role="button"
        tabIndex={0}
        onKeyUp={() => {}}
        onClick={handleUndo}
      >
        Undo
      </span>
    </span>,
    {
      position: positions || 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      className: 'styled-success-on-switch-status',
    },
  );
  return null;
};
