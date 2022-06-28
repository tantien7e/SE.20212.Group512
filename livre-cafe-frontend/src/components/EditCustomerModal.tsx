import {
  selectCustomersUpdateLoading,
  updateCustomer,
} from '@app/app/features/customers/customers-slice';
import PhoneInputCustom from '@app/components/PhoneInputCustom';
import { InventoryType } from '@app/constants';
import {
  CUSTOMER,
  CustomerGender,
  CustomerInterface,
  RankType,
} from '@app/models/customer.interface';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Divider,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import { CountryData } from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';

const style = {
  // position: 'absolute' as 'absolute',
  // top: '50%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '768px',
  bgcolor: 'background.paper',
  border: '0.5px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  //   minHeight: 'calc(100vh - 64px)',
  height: 'auto',
  margin: '32px auto',
  p: 4,
};

const Input = styled('input')({
  display: 'none',
});

interface AddModalProps {
  open: boolean;
  handleClose: () => void;
  item?: CustomerInterface;
  type: 'CUSTOMER';
}

interface CustomerStateInterface {
  customerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  rankingPoints: number;
  ranking: RankType;
  gender: CustomerGender;
  exchangeablePoints: number;
}

export interface ErrorStateInterface {
  customerId: boolean;
  firstName: boolean;
  lastName: boolean;
  phone: boolean;
  email: boolean;
  points: boolean;
  ranking: boolean;
}

export default function EditCustomerModal(props: AddModalProps) {
  const dispatch = useDispatch();
  const customersLoading = useSelector(selectCustomersUpdateLoading);
  const [addSuccess, setAddSuccess] = useState(false);
  const { open, handleClose, type, item } = props;
  const isProduct = Object.values(InventoryType).includes(
    type as InventoryType,
  );
  const isCustomer = type === CUSTOMER;

  const [customerState, setCustomerState] = useState<CustomerStateInterface>({
    customerId: item?._id || '',
    firstName: item?.firstName || '',
    lastName: item?.lastName || '',
    phone: String(item?.phone) || '',
    email: item?.email || '',
    rankingPoints: item?.rankingPoints || 0,
    exchangeablePoints: item?.exchangeablePoints || 0,
    ranking: item?.ranking || RankType.SILVER,
    gender: item?.gender || CustomerGender.NA,
  });

  const [errorState, setErrorState] = useState<ErrorStateInterface>({
    customerId: false,
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
    points: false,
    ranking: false,
  });
  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files?.[0];
    reader.onloadend = () => {
      setCustomerState((state) => ({
        ...state,
        imageUrl: reader.result as string,
      }));

      setErrorState((state) => ({
        ...state,
        imageUrl: !reader.result,
      }));
    };
    if (!file) {
      return;
    }
    reader.readAsDataURL(file);
  };

  const handleChangeText = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | SelectChangeEvent,
    field: keyof CustomerStateInterface,
    country?: CountryData,
  ) => {
    const isNumberField = field === 'phone';

    setCustomerState((prevState) => {
      return { ...prevState, [field]: e.target.value };
    });

    let phoneValue = '';
    if (field === 'phone') {
      const valueCopy = e.target.value.slice();
      const regex = new RegExp(`^${country?.dialCode}`);
      phoneValue = valueCopy.replace(regex, '');
    }
    setErrorState((prevState) => {
      return {
        ...prevState,
        [field]: field === 'phone' ? !phoneValue : !e.target.value,
      };
    });
  };

  const generatePostData = (
    body: CustomerStateInterface,
  ): CustomerInterface => {
    return {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      rankingPoints: Number(body.rankingPoints),
      exchangeablePoints: Number(body.exchangeablePoints),
      ranking: body.ranking,
      gender: body.gender,
      _id: body?.customerId,
      ordersHistory: item?.ordersHistory || [],
    };
  };

  const handleSave = () => {
    const { firstName, phone, email } = customerState;
    const error = {
      firstName: !firstName,
      phone: !phone,
      email: !email,
      points: false,
      ranking: false,
      lastName: false,
      gender: false,
      customerId: false,
    };
    setErrorState(error);
    const passable = !(Object.values(error).findIndex((item) => item) > -1);
    if (!passable) return;
    const customerData = generatePostData(customerState);
    dispatch(updateCustomer(customerData));
    setAddSuccess(true);
  };

  React.useEffect(() => {
    const loading = customersLoading;
    if (addSuccess && !loading) {
      handleClose();
    }
  }, [addSuccess, customersLoading]);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            color={theme.palette.secondary.contrastText}
            style={{ padding: ` ${theme.spacing(1)} 0` }}
          >
            <strong style={{ textTransform: 'capitalize' }}>
              Edit {type.toLowerCase()}
            </strong>
          </Typography>
          <Divider />

          {isCustomer && (
            <Box my={2}>
              <Grid container spacing={2}>
                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="first-name">
                      <Grid container>
                        <Typography>First Name</Typography>{' '}
                        <Typography color="error">*</Typography>
                      </Grid>
                    </label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <TextField
                      variant="outlined"
                      id="first-name"
                      aria-describedby="my-helper-text"
                      fullWidth
                      value={customerState?.firstName}
                      onChange={(e) => handleChangeText(e, 'firstName')}
                      error={errorState.firstName}
                      helperText={
                        errorState.firstName && 'First Name must not be empty'
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="last-name">Last Name</label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <TextField
                      variant="outlined"
                      id="last-name"
                      aria-describedby="my-helper-text"
                      fullWidth
                      value={customerState?.lastName}
                      onChange={(e) => handleChangeText(e, 'lastName')}
                    />
                  </Grid>
                </Grid>
                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="phone">
                      <Grid container>
                        <Typography>Phone</Typography>{' '}
                        <Typography color="error">*</Typography>
                      </Grid>
                    </label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <PhoneInputCustom
                      value={customerState.phone}
                      onChange={(value, country: CountryData) => {
                        const event = {
                          target: {
                            value: value,
                          },
                        };

                        handleChangeText(event as any, 'phone', country);
                      }}
                      error={errorState.phone}
                    />
                  </Grid>
                </Grid>
                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="email">
                      <Grid container>
                        <Typography>Email</Typography>{' '}
                        <Typography color="error">*</Typography>
                      </Grid>
                    </label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <TextField
                      variant="outlined"
                      id="email"
                      aria-describedby="my-helper-text"
                      fullWidth
                      value={customerState?.email}
                      onChange={(e) => handleChangeText(e, 'email')}
                      error={errorState.email}
                      helperText={errorState.email && 'Email must not be empty'}
                    />
                  </Grid>
                </Grid>

                {/* <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="points">
                      <Grid container>
                        <Typography>Points</Typography>{' '}
                        <Typography color="error">*</Typography>
                      </Grid>
                    </label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <TextField
                      variant="outlined"
                      id="points"
                      aria-describedby="my-helper-text"
                      fullWidth
                      value={customerState?.points}
                      onChange={(e) => handleChangeText(e, 'points')}
                      InputProps={{
                        // inputMode: 'numeric',
                        inputComponent: NumberFormatCustom as any,
                      }}
                      error={errorState.points}
                      helperText={
                        errorState.points && 'points must not be empty'
                      }
                    />
                  </Grid>
                </Grid> */}

                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="points">Gender</label>
                  </Grid>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={customerState.gender}
                    onChange={(e) => handleChangeText(e, 'gender')}
                  >
                    <MenuItem value={CustomerGender.FEMALE}>Female</MenuItem>
                    <MenuItem value={CustomerGender.MALE}>Male</MenuItem>
                    <MenuItem value={CustomerGender.NA}>N/A</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Box>
          )}
          <Divider />
          <Grid
            container
            justifyContent="space-between"
            padding={`${theme.spacing(2)} 0`}
          >
            <Grid>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              {' '}
              <LoadingButton
                variant="contained"
                loading={customersLoading}
                loadingPosition="end"
                onClick={() => handleSave()}
                endIcon={<SaveIcon />}
              >
                Save Changes{' '}
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom = React.forwardRef<NumberFormat<string>, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
  },
);
