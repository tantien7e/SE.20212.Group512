import {
  addCustomer,
  fetchCustomers,
  selectCustomers,
} from '@app/app/features/customers/customers-slice';
import { ErrorStateInterface } from '@app/components/AddCustomerModal';
import GroupedSearchBar from '@app/components/GroupedSearchBar';
import {
  AddCustomerBox,
  CustomerDetailsBlock,
  CustomerStateInterface,
} from '@app/components/NormalCheckoutModal';
import PickerButton from '@app/components/PickerButton';
import { BootstrapDialogTitle } from '@app/components/ViewOrderModal';
import { CartAction, Store } from '@app/context/Store';
import {
  AreaInterface,
  CustomerGender,
  CustomerInterface,
  CustomerPostData,
  RankType,
} from '@app/models';
import { ReservationPostData } from '@app/models/reservation.interface';
import { renderTimeSlots, roundupHour } from '@app/utils';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { Add } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface AddReservationProps {
  open: boolean;
  handleClose: () => void;
  area: AreaInterface;
}

function AddReservationModal(props: AddReservationProps) {
  const { open, handleClose, area } = props;
  const [date, setDate] = useState<Date>(new Date());
  const customersSelector = useSelector(selectCustomers);
  const { customers, loading, addLoading } = customersSelector;
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInterface>();
  const [filterText, setFilterText] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  const [reservationState, setReservationState] = useState<ReservationPostData>(
    {
      date: new Date(),
      duration: 120,
      area: area,
      additionalRequirements: '',
      time: roundupHour(moment(new Date())).format('HH:mm'),
    },
  );

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
  const [addSuccess, setAddSuccess] = useState(false);

  const [isAddNew, setIsAddNew] = useState(false);
  const dispatch = useDispatch();
  const handleSelect = (customer: CustomerInterface) => {
    setIsAddNew(false);
    setSelectedCustomer(customer);
    handleChangeState('customer')(customer);
    setFilterText(`${customer.firstName} ${customer.lastName}`);
  };

  const handleChangeState =
    (field: keyof ReservationPostData) => (value: any) => {
      setReservationState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };

  const theme = useTheme();

  const handleSearch = (text = '') => {
    if (!customers) return;
    const filteredRows = customers.filter((customer) => {
      const textTokens = text.split(' ');
      const hasConflict = textTokens.find((token) => {
        return !(
          customer.firstName.toLowerCase().includes(token) ||
          customer.lastName.toLowerCase().includes(token) ||
          String(customer.phone).toLowerCase().includes(token)
        );
      });
      return !hasConflict;
    });
    setFilteredCustomers(filteredRows);
  };
  const onSearchChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setFilterText(e.target.value);
    const text = e.target.value.toLowerCase();
    handleSearch(text);
  };

  const generatePostData = (body: CustomerStateInterface): CustomerPostData => {
    return {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      rankingPoints: Number(body.points),
      exchangeablePoints: Number(body.points),
      gender: body.gender,
      ordersHistory: [],
    };
  };

  const handleAddCustomer = () => {
    setAddSuccess(false);
    if (!isAddNew) return false;
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
    if (!passable) return false;
    const customerData = generatePostData(customerState);
    dispatch(addCustomer(customerData as CustomerInterface));
    setAddSuccess(true);
    return true;
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const handleAddReservationToCart = () => {
    if (state.reservation) {
      toastError('Already have a reservation in cart, delete it first');
      handleClose();

      return;
    }

    ctxDispatch({
      type: CartAction.ADD_RESERVATION,
      payload: reservationState,
    });

    toastInformSuccess("Reservation's been successfully added");
    handleClose();
  };

  useEffect(() => {
    if (!customers) {
      dispatch(fetchCustomers());
    }
    if (addSuccess) {
      setIsAddNew(false);
    }

    if (addSuccess && customers && !addLoading) {
      handleChangeState('customer')(
        customers.find(
          (cus: CustomerInterface) => cus.email === customerState.email,
        ),
      );
    }

    handleSearch(filterText);
  }, [dispatch, customers, addSuccess]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth="md"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            color={theme.palette.secondary.contrastText}
            style={{ padding: ` ${theme.spacing(1)} 0` }}
          >
            <strong style={{ textTransform: 'capitalize' }}>
              Add Reservation
            </strong>
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent
          dividers
          sx={{
            minWidth: '600px',
            backgroundColor: theme.palette.secondary.main,
            // width: '80vw',
            maxWidth: '100%',
          }}
        >
          <Grid container gap={2}>
            <Grid
              component="div"
              item
              container
              borderRadius={2}
              p={2}
              sx={{ backgroundColor: 'white' }}
              xs={12}
              direction="column"
              rowGap={3}
              px={2}
            >
              <Grid item>
                <Typography
                  variant="h6"
                  color={theme.palette.secondary.contrastText}
                >
                  Reservation Details
                </Typography>
              </Grid>
              <Grid item container direction={'column'} rowGap={1}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={theme.palette.secondary.contrastText}
                >
                  Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['day']}
                    // label="Just date"
                    value={reservationState.date}
                    onChange={(newValue) => {
                      handleChangeState('date')(newValue || new Date());
                    }}
                    disablePast
                    rifmFormatter={() => {
                      return moment(reservationState.date).format(
                        'ddd, D MMM YYYY',
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        {...params}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'space-between',
                          color: theme.palette.secondary.contrastText,
                          borderColor: 'rgba(0, 40, 100, 0.12)',
                          fontWeight: 400,
                        }}
                      ></TextField>
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item container direction={'column'} rowGap={1}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={theme.palette.secondary.contrastText}
                >
                  Duration
                </Typography>

                <FormControl variant="outlined" fullWidth>
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={reservationState.duration}
                    onChange={(e) =>
                      handleChangeState('duration')(e.target.value)
                    }
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'space-between',
                      color: theme.palette.secondary.contrastText,
                      borderColor: 'rgba(0, 40, 100, 0.12)',
                      fontWeight: 400,
                    }}
                  >
                    {Array(6)
                      .fill(1)
                      .map((_val, index) => {
                        const unit = 60;
                        const value = unit * (index + 1);
                        const hours = (value * 1.0) / 60;
                        const text =
                          hours > 1
                            ? `${value / 60} hours`
                            : `${value / 60} hour`;
                        return <MenuItem value={hours}>{text}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item container direction={'column'} rowGap={1}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={theme.palette.secondary.contrastText}
                >
                  Time
                </Typography>
                <FormControl variant="outlined" fullWidth>
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={reservationState.time}
                    onChange={(e) => handleChangeState('time')(e.target.value)}
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'space-between',
                      color: theme.palette.secondary.contrastText,
                      borderColor: 'rgba(0, 40, 100, 0.12)',
                      fontWeight: 400,
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 256,
                        },
                      },
                    }}
                  >
                    {renderTimeSlots(reservationState.date).map(
                      (val, index) => {
                        return <MenuItem value={val}>{val}</MenuItem>;
                      },
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item container direction={'column'} rowGap={1}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={theme.palette.secondary.contrastText}
                >
                  Area
                </Typography>
                <PickerButton
                  fontColor={theme.palette.secondary.contrastText}
                  endIcon={<KeyboardArrowDownIcon />}
                  disabled
                >
                  {area.name}
                </PickerButton>
              </Grid>
              <Grid item container direction={'column'} rowGap={1}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={theme.palette.secondary.contrastText}
                >
                  Additional Request
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  sx={{ fontSize: 0.8 }}
                  placeholder="Specify"
                  onChange={(e) =>
                    handleChangeState('additionalRequirements')(e.target.value)
                  }
                ></TextField>
              </Grid>
            </Grid>
            {/* <Grid
              component="div"
              item
              borderRadius={2}
              p={2}
              container
              sx={{ backgroundColor: 'white', height: 'fit-content' }}
              xs
              direction="column"
              //   rowSpacing={2}
              rowGap={2}
            >
              <Grid
                item
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  color={theme.palette.secondary.contrastText}
                >
                  Customer Details
                </Typography>
                <Tooltip title="Add New Customer">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setIsAddNew(true);
                      onSearchChange({
                        target: { value: '' },
                      } as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>);
                    }}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <Box component="form" noValidate autoComplete="off">
                    <GroupedSearchBar
                      onSearchChange={onSearchChange}
                      filterText={filterText}
                      rows={filteredCustomers || []}
                      handleSelect={handleSelect}
                      selectedValue={selectedCustomer}
                      width={'auto'}
                    />
                  </Box>
                </Grid>
              </Grid>

              {reservationState.customer && !isAddNew && (
                <Grid item container xs={12}>
                  <CustomerDetailsBlock
                    selectedCustomer={reservationState.customer}
                    noImage
                    noTitle
                    m={-2}
                  />
                </Grid>
              )}

              {isAddNew && (
                <Grid item container xs={12}>
                  <AddCustomerBox
                    customerState={customerState}
                    setCustomerState={setCustomerState}
                    errorState={errorState}
                    setErrorState={setErrorState}
                  />

                  <Grid item container justifyContent={'space-between'}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setIsAddNew(false)}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="outlined"
                      onClick={() => handleAddCustomer()}
                      loading={addLoading}
                    >
                      Add Customer
                    </LoadingButton>
                  </Grid>
                </Grid>
              )}
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAddReservationToCart()}
          >
            Add Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddReservationModal;
