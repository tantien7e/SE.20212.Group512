import {
  addCustomer,
  selectCustomersAddLoading,
} from '@app/app/features/customers/customers-slice';
import PhoneInputCustom from '@app/components/PhoneInputCustom';
import { InventoryType } from '@app/constants';
import {
  CUSTOMER,
  CustomerGender,
  CustomerInterface,
  RankType,
} from '@app/models/customer.interface';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { genRanking } from '@app/utils';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Divider,
  FormHelperText,
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
import PhoneInput, { CountryData } from 'react-phone-input-2';
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
  item?: DrinkInterface | BookInterface;
  type: 'CUSTOMER';
}

interface CustomerStateInterface {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  points: number;
  ranking: RankType;
  gender: CustomerGender;
}

export interface ErrorStateInterface {
  firstName: boolean;
  lastName: boolean;
  phone: boolean;
  email: boolean;
  points: boolean;
  ranking: boolean;
  gender: boolean;
}

export default function AddCustomerModal(props: AddModalProps) {
  const dispatch = useDispatch();
  const customersLoading = useSelector(selectCustomersAddLoading);
  const [addSuccess, setAddSuccess] = useState(false);
  const { open, handleClose, type } = props;
  const isProduct = Object.values(InventoryType).includes(
    type as InventoryType,
  );
  const isCustomer = type === CUSTOMER;

  const [customerState, setCustomerState] = useState<CustomerStateInterface>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    points: 0,
    ranking: RankType.SILVER,
    gender: CustomerGender.NA,
  });

  const [errorState, setErrorState] = useState<ErrorStateInterface>({
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
    points: false,
    ranking: false,
    gender: false,
  });
  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;

  const handleChangeText = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | SelectChangeEvent,
    field: keyof CustomerStateInterface,
    country?: CountryData,
  ) => {

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
  ): CustomerStateInterface => {
    return {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      points: Number(body.points),
      ranking: genRanking(body.points),
      gender: body.gender,
    };
  };

  const handleAdd = () => {
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
    dispatch(addCustomer(customerData as CustomerInterface));
    setAddSuccess(true);
  };

  React.useEffect(() => {
    const loading = customersLoading;
    if (addSuccess && !customersLoading) {
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
              Add {type.toLowerCase()}
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
                    {/* <TextField
                      variant="outlined"
                      id="phone"
                      aria-describedby="my-helper-text"
                      fullWidth
                      value={customerState?.phone}
                      onChange={(e) => handleChangeText(e, 'phone')}
                      error={errorState.phone}
                      helperText={errorState.phone && 'Phone must not be empty'}
                      InputProps={{
                        // inputMode: 'numeric',
                        inputComponent: PhoneInputCustom as any,
                      }}
                      // inputProps={{
                      //   thousandSeparator: false,
                      // }}
                    /> */}
                    <PhoneInputCustom
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

                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="points">Points</label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <TextField
                      variant="outlined"
                      id="points"
                      aria-describedby="my-helper-text"
                      fullWidth
                      value={customerState?.points}
                      onChange={(e) => handleChangeText(e, 'points')}
                      error={errorState.points}
                      InputProps={{
                        inputMode: 'numeric',
                        inputComponent: NumberFormatCustom as any,
                      }}
                      helperText={
                        errorState.points && 'points must not be empty'
                      }
                    />
                  </Grid>
                </Grid>

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
                onClick={() => handleAdd()}
                endIcon={<AddIcon />}
              >
                Add{' '}
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
        {...other}
      />
    );
  },
);
