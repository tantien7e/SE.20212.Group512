import {
  selectAuthLoading,
  selectVerify,
  submitLogin,
  submitSignup,
} from '@app/app/features/authentication/authentication-slice';
import { INVENTORY_PATH } from '@app/constants';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
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
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
      position="relative"
    >
      {/* <Box
        position="absolute"
        top={0}
        left={0}
        p={1}
        display="flex"
        justifyContent="center"
        m="auto"
        width="calc(100% - 16px)"
        sx={{ backgroundColor: '#f2f1f2' }}
      >
        Don't have an account?{' '}
        <Link to="/signup">
          <Typography ml={1} mb={1} color={theme.palette.primary.main}>
            Signup
          </Typography>
        </Link>
      </Box> */}
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
        <Grid item display="flex" alignItems="center">
          <Typography mt={2} variant="body1">
            Enter your details to get signed in or
          </Typography>

          <Button
            onClick={() => navigate('/signup')}
            sx={{ textTransform: 'none', marginTop: 2 }}
          >
            <Typography
              color={theme.palette.primary.main}
              variant="body1"
              textAlign="center"
              sx={{ textDecoration: 'underline' }}
            >
              Signup
            </Typography>
          </Button>
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
