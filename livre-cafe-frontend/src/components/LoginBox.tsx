import {
  Box,
  BoxProps,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthLoading,
  selectUser,
  selectVerify,
  submitLogin,
} from '@app/app/features/authentication/authentication-slice';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { INVENTORY_PATH } from '@app/constants';

interface LoginBoxProps extends BoxProps {}
interface InputState {
  username: string;
  passcode: string;
  showPasscode: boolean;
}

function LoginBox(props: LoginBoxProps) {
  const intputWidth = 350;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [values, setValues] = useState<InputState>({
    username: '',
    passcode: '',
    showPasscode: false,
  });

  const loginLoading = useSelector(selectAuthLoading);
  const isVerified = useSelector(selectVerify);
  const navigate = useNavigate();
  const handleChange =
    (prop: keyof InputState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPasscode = () => {
    setValues({
      ...values,
      showPasscode: !values.showPasscode,
    });
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleSignin = () => {
    dispatch(
      submitLogin({ username: values.username, password: values.passcode }),
    );
  };

  useEffect(() => {
    if (!loginLoading && isVerified) navigate(INVENTORY_PATH);
  }, [loginLoading, isVerified]);

  return (
    <Box
      boxShadow={theme.shadows[1]}
      p={4}
      sx={{
        backgroundColor: 'white',
        maxWidth: 768,
        width: 'auto',
        minHeight: 400,
        borderRadius: theme.spacing(2),
      }}
      {...props}
      display="flex"
      alignItems="center"
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Grid item>
          <Typography mt={2} variant="h5" fontWeight={600}>
            Agent Login
          </Typography>
        </Grid>
        <Grid item>
          <Typography mt={2} variant="body1">
            Enter your details to get signed in
          </Typography>
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          marginTop={5}
          rowSpacing={2}
        >
          <Grid item minWidth={intputWidth}>
            <OutlinedInput
              value={values.username}
              onChange={handleChange('username')}
              placeholder="Enter username"
              fullWidth
            />
          </Grid>
          <Grid item minWidth={intputWidth}>
            <OutlinedInput
              placeholder="Passcode"
              type={values.showPasscode ? 'text' : 'password'}
              value={values.passcode}
              onChange={handleChange('passcode')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasscode}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPasscode ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
          </Grid>
          <Grid item marginY={2} minWidth={intputWidth}>
            <LoadingButton
              variant="contained"
              fullWidth
              sx={{ textTransform: 'capitalize' }}
              onClick={handleSignin}
              loading={loginLoading}
            >
              <Typography my={0.5} fontWeight={500}>
                Sign in
              </Typography>
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginBox;
