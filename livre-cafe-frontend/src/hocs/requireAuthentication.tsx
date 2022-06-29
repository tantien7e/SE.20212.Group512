import {
  selectVerify,
  selectVerifyLoading,
  verify,
} from '@app/app/features/authentication/authentication-slice';
import { LOGIN_PATH } from '@app/constants';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function requireAuthentication(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isVerified = useSelector(selectVerify);
    const authLoading = useSelector(selectVerifyLoading);
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate(LOGIN_PATH);
        return;
      }
      dispatch(
        verify({
          callback: (success: boolean) => {
            if (success) navigate(LOGIN_PATH);
          },
        }),
      );
    }, []);

    return <div>{isVerified && <Component {...props} />}</div>;
  };
}

export default requireAuthentication;
