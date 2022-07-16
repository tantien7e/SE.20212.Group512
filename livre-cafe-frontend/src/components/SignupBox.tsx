import authenticationApi from '@app/api/authenticationApi';
import {
  clearPhone,
  selectAuthLoading,
  selectVerifiedStaff,
  selectVerify,
  selectVerifyPhoneLoading,
  submitSignup,
  verifyPhone,
} from '@app/app/features/authentication/authentication-slice';
import PhoneInputCustom from '@app/components/PhoneInputCustom';
import { INVENTORY_PATH } from '@app/constants';
import { getErrorMessage } from '@app/utils';
import { toastError } from '@app/utils/toast';
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
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { CountryData } from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface SignupBoxProps extends BoxProps {}
interface InputState {
  username: string;
  passcode: string;
  showPasscode: boolean;
  phone: string;
  isPhoneVerified?: boolean;
  otp: string;
}

function SignupBox(props: SignupBoxProps) {
  const intputWidth = 350;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [values, setValues] = useState<InputState>({
    username: '',
    passcode: '',
    showPasscode: false,
    phone: '',
    isPhoneVerified: false,
    otp: '',
  });

  const authLoading = useSelector(selectAuthLoading);
  const verifyPhoneLoading = useSelector(selectVerifyPhoneLoading);
  const isVerified = useSelector(selectVerify);
  const verifiedStaff = useSelector(selectVerifiedStaff);
  const navigate = useNavigate();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

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
  const handleVerifyOTP = async () => {
    setIsOtpLoading(true);
    try {
      const response = await authenticationApi.verifyCode({
        phone: values.phone,
        code: values.otp,
      });
      console.log(response);
      if (response?.data?.success) {
        setIsOtpVerified(true);
      }
      setIsOtpLoading(false);
    } catch (error) {
      const message = getErrorMessage(error as AxiosError);
      toastError(message);
      setIsOtpLoading(false);
    }
  };

  const handleChangePhone = () => {
    dispatch(clearPhone());
    setIsOtpVerified(false);
    handleChange('otp')({
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>);
  };
  const handleSignup = () => {
    if (!!verifiedStaff) {
      dispatch(
        submitSignup({
          username: values.username,
          password: values.passcode,
          _id: verifiedStaff._id || '',
        }),
      );
      return;
    }
    console.log('verified phone');
    dispatch(verifyPhone(values.phone));
  };

  useEffect(() => {
    if (!authLoading && isVerified) navigate(INVENTORY_PATH);
  }, [authLoading, isVerified]);

  const renderBody = () => {
    if (!verifiedStaff) {
      return (
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          marginTop={5}
          rowSpacing={2}
        >
          <Grid item minWidth={intputWidth}>
            <PhoneInputCustom
              onChange={(value, _country: CountryData) => {
                const event = {
                  target: {
                    value: value,
                  },
                };

                handleChange('phone')(event as any);
              }}
              value={values.phone}
            />
          </Grid>

          <Grid item marginY={2} minWidth={intputWidth}>
            <LoadingButton
              variant="contained"
              fullWidth
              sx={{ textTransform: 'capitalize' }}
              onClick={handleSignup}
              loading={verifyPhoneLoading}
            >
              <Typography my={0.5} fontWeight={500}>
                Verify Phone Number
              </Typography>
            </LoadingButton>
          </Grid>
        </Grid>
      );
    }

    if (!isOtpVerified) {
      return (
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          my={2}
          spacing={2}
        >
          <Grid item>
            <Typography width={400} textAlign="center" variant="h6">
              Enter the verification code
            </Typography>
            <Typography textAlign="center"> (available in 5 mins)</Typography>
          </Grid>
          <Grid item my={2} mx={-2}>
            <OtpInput
              value={values.otp}
              onChange={(otp: string) =>
                handleChange('otp')({
                  target: { value: otp },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              numInputs={6}
              separator={<span>o</span>}
              inputStyle={{
                width: '3rem',
                height: '3rem',
                margin: '0 1rem',
                fontSize: '2rem',
                borderRadius: '4px',
                border: '1px solid rgba(0, 0, 0, 0.3)',
              }}
              isInputNum
            />
          </Grid>

          <Grid item container justifyContent="space-between" mt={2}>
            <LoadingButton
              variant="outlined"
              onClick={() => handleChangePhone()}
            >
              Change Phone num
            </LoadingButton>
            <LoadingButton
              variant="contained"
              disabled={values.otp.length < 6}
              onClick={() => handleVerifyOTP()}
              loading={isOtpLoading}
            >
              Verify
            </LoadingButton>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        rowSpacing={2}
      >
        <Grid item>
          <Box
            sx={{
              padding: `${theme.spacing(2)} 0`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 'none',
            }}
          >
            {verifiedStaff?.imageUrl && (
              <div
                style={{
                  // overflow: 'hidden',
                  width: 128,
                  height: 128,
                }}
              >
                <img
                  src={verifiedStaff.imageUrl}
                  alt={'item image'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    // maxHeight: '50vh',
                    margin: `${theme.spacing(2)} 0`,
                    borderRadius: '50%',
                  }}
                />
              </div>
            )}
            <br />
            <Typography variant="body1">
              <strong>{verifiedStaff.firstName}</strong>{' '}
              {verifiedStaff.lastName || ''}
            </Typography>
          </Box>
        </Grid>
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
            onClick={handleSignup}
            loading={authLoading}
          >
            <Typography my={0.5} fontWeight={500}>
              Sign up
            </Typography>
          </LoadingButton>
        </Grid>

        <Grid
          item
          marginY={0}
          minWidth={intputWidth}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography>Or</Typography>{' '}
          <Button
            onClick={() => {
              handleChangePhone();
            }}
            sx={{ textTransform: 'none' }}
          >
            <Typography sx={{ textDecoration: 'underline' }}>
              use another phone number
            </Typography>
          </Button>
        </Grid>
      </Grid>
    );
  };

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
            Agent Signup
          </Typography>
        </Grid>
        <Grid item display="flex" alignItems="center">
          <Typography mt={2} variant="body1">
            Enter your details to create account or
          </Typography>

          <Button
            onClick={() => navigate('/login')}
            sx={{ textTransform: 'none', marginTop: 2 }}
          >
            <Typography
              color={theme.palette.primary.main}
              variant="body1"
              textAlign="center"
              sx={{ textDecoration: 'underline' }}
            >
              Signin
            </Typography>
          </Button>
        </Grid>
        {renderBody()}
      </Grid>
    </Box>
  );
}

export default SignupBox;
