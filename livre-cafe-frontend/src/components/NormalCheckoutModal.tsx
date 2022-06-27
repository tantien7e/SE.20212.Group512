import {
  addCustomer,
  fetchCustomers,
  selectCustomers,
  selectCustomersAddLoading,
} from '@app/app/features/customers/customers-slice';
import {
  addOrder,
  fetchOrders,
  selectOrdersAddLoading,
  selectOrdersError,
} from '@app/app/features/orders/orders-slice';
import GroupedSearchBar from '@app/components/GroupedSearchBar';
import Invoice from '@app/components/Invoice';
import PhoneInputCustom from '@app/components/PhoneInputCustom';
import VoucherSelect, { VoucherOption } from '@app/components/VoucherSelect';
import { NormalCheckoutTabIndex } from '@app/constants';
import { CartAction, Store } from '@app/context/Store';
import { useFetchOrders } from '@app/hooks/useFetchOrders';
import { OrderInterface, OrderStatusType, VoucherInterface } from '@app/models';
import {
  CustomerGender,
  CustomerInterface,
  RankType,
} from '@app/models/customer.interface';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { TabPanel } from '@app/screens/InventoryScreen';
import {
  a11yProps,
  genAvatarImage,
  genRanking,
  getSalutation,
  getTotalCost,
} from '@app/utils';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Divider,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
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
  item?: DrinkInterface | BookInterface;
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

export default function NormalCheckoutModal(props: AddModalProps) {
  const dispatch = useDispatch();

  const orderLoading = useSelector(selectOrdersAddLoading);
  const orderError = useSelector(selectOrdersError);
  const [addSuccess, setAddSuccess] = useState(false);
  const { open, handleClose } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);

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

  const [tabIndex, setTabIndex] = useState(0);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInterface>();
  const [isAddNew, setIsAddNew] = useState(false);
  const [filterText, setFilterText] = useState('');
  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;
  const customersSelector = useSelector(selectCustomers);
  const { customers, loading } = customersSelector;
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [vouchers, setVouchers] = useState<VoucherInterface[]>([]);
  const [isPost, setIsPost] = useState(false);

  const onSearchChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setFilterText(e.target.value);
    const text = e.target.value.toLowerCase();
    handleSearch(text);
  };

  const handleSearch = (text = '') => {
    const filteredRows = customers.filter((customer) => {
      const textTokens = text.split(' ');
      const hasConflict = textTokens.find((token) => {
        return !(
          customer.firstName.toLowerCase().includes(token) ||
          customer.lastName.toLowerCase().includes(token) ||
          customer.phone.toLowerCase().includes(token)
        );
      });
      return !hasConflict;
    });
    setFilteredCustomers(filteredRows);
  };
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

  const handleSelect = (customer: CustomerInterface) => {
    setSelectedCustomer(customer);
    setFilterText(`${customer.firstName} ${customer.lastName}`);
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

  const handleAddCustomerToCart = () => {
    if (!selectedCustomer) {
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

      return;
    }

    ctxDispatch({
      type: CartAction.SELECT_CUSTOMER,
      payload: selectedCustomer,
    });

    toastInformSuccess('Select customer successfully!');
  };

  const handleAddVouchersToCart = () => {
    if (vouchers && vouchers.length) {
      ctxDispatch({
        type: CartAction.ADD_VOUCHERS,
        payload: vouchers,
      });
      toastInformSuccess('Select vouchers successfully!');
    }
  };

  const handlePlaceOrder = () => {
    const postOrderData: OrderInterface = {
      customer: selectedCustomer || 'Guest',
      items: state.cart.cartItems,
      vouchers: vouchers,
      status: OrderStatusType.PENDING,
      bookedAt: new Date(),
      totalCost: getTotalCost(state),
    };
    dispatch(addOrder(postOrderData));
    setIsPost(true);
  };

  useEffect(() => {
    if (!orderLoading && isPost && !orderError) {
      ctxDispatch({ type: CartAction.CART_CLEAR });
      dispatch(fetchOrders());
      handleClose();
    }
  }, [orderLoading, isPost, orderError]);

  React.useEffect(() => {
    if (!customers.length) {
      dispatch(fetchCustomers());
    }
    handleSearch(filterText);
  }, [dispatch, customers]);

  useEffect(() => {
    setSelectedCustomer(state.customer);
  }, []);

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
              Normal Checkout
            </strong>
          </Typography>
          <Divider />
          <TabPanel
            value={tabIndex}
            index={NormalCheckoutTabIndex.CUSTOMER}
            mt={-3}
          >
            <Grid container my={1}>
              <Typography
                variant="h6"
                color={theme.palette.secondary.contrastText}
                style={{ padding: ` ${theme.spacing(1)} 0` }}
              >
                {isAddNew
                  ? 'Add new customer or '
                  : 'Find customer by phone, name or'}
              </Typography>

              <Button onClick={() => setIsAddNew(!isAddNew)}>
                <Typography variant="h6">
                  {isAddNew ? 'Search for customer' : 'Add New Customer'}
                </Typography>{' '}
              </Button>
            </Grid>
            {isAddNew ? (
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
                        helperText={
                          errorState.email && 'Email must not be empty'
                        }
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
            ) : (
              <Box my={2}>
                <Box component="form" noValidate autoComplete="off">
                  <GroupedSearchBar
                    onSearchChange={onSearchChange}
                    filterText={filterText}
                    rows={filteredCustomers}
                    handleSelect={handleSelect}
                    selectedValue={selectedCustomer}
                  />
                </Box>
                {selectedCustomer && (
                  <CustomerDetailsBlock selectedCustomer={selectedCustomer} />
                )}
              </Box>
            )}
          </TabPanel>
          <TabPanel
            value={tabIndex}
            index={NormalCheckoutTabIndex.VOUCHERS}
            mt={-3}
          >
            <Box
              sx={{
                // backgroundColor: theme.block?.gray,
                borderRadius: 2,
              }}
              mt={1}
              mb={2}
            >
              {' '}
              <Typography
                variant="h6"
                color={theme.palette.secondary.contrastText}
                mb={2}
              >
                Voucher Details
              </Typography>
              <Box mb={2}>
                <VoucherSelect
                  selectedVouchers={vouchers}
                  setSelectedVouchers={(selected) => {
                    setVouchers(selected);
                  }}
                />
              </Box>
              {vouchers?.length > 0 && (
                <Grid container direction="column" spacing={2}>
                  {vouchers.map((voucher) => {
                    return (
                      <Grid item>
                        {' '}
                        <VoucherOption showDetails {...voucher} />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </TabPanel>
          <TabPanel
            value={tabIndex}
            index={NormalCheckoutTabIndex.INVOICE}
            mt={-1}
            mb={3}
          >
            <Invoice vouchers={vouchers} />
          </TabPanel>
          <Divider />
          <Grid
            container
            justifyContent="space-between"
            padding={`${theme.spacing(2)} 0`}
            direction="row"
          >
            <Grid item display="flex" alignItems="center">
              <Button
                variant="contained"
                color="error"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Grid>

            <Grid item sx={{ bgcolor: 'background.paper' }}>
              <Tabs
                value={tabIndex}
                onChange={(_e, newValue) => setTabIndex(newValue)}
                centered
              >
                <Tab
                  label="Customer"
                  {...a11yProps(NormalCheckoutTabIndex.CUSTOMER)}
                />
                <Tab
                  label="Vouchers"
                  {...a11yProps(NormalCheckoutTabIndex.VOUCHERS)}
                  disabled={!state?.customer}
                />
                <Tab
                  label="Invoice"
                  {...a11yProps(NormalCheckoutTabIndex.INVOICE)}
                  disabled={!state?.vouchers}
                />
              </Tabs>
            </Grid>

            <Grid item display="flex" alignItems="center">
              {' '}
              <TabButton
                orderLoading={orderLoading}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                handlePlaceOrder={handlePlaceOrder}
                handleAddCustomerToCart={handleAddCustomerToCart}
                disabled={!selectedCustomer}
                handleAddVouchersToCart={handleAddVouchersToCart}
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

interface TabButtonProps {
  orderLoading: boolean;
  disabled?: boolean;
  tabIndex: number;
  setTabIndex: (value: React.SetStateAction<number>) => void;
  handlePlaceOrder: () => void;
  handleAddCustomerToCart: () => void;
  handleAddVouchersToCart: () => void;
}

function TabButton(props: TabButtonProps) {
  const {
    orderLoading,
    disabled,
    tabIndex,
    setTabIndex,
    handlePlaceOrder,
    handleAddCustomerToCart,
    handleAddVouchersToCart,
  } = props;
  switch (tabIndex) {
    case NormalCheckoutTabIndex.CUSTOMER:
      return (
        <Grid item display="flex" alignItems="center">
          {' '}
          <LoadingButton
            variant="contained"
            loadingPosition="end"
            onClick={() => {
              setTabIndex(tabIndex + 1);
              handleAddCustomerToCart();
            }}
            disabled={disabled}
          >
            Next
          </LoadingButton>
        </Grid>
      );
    case NormalCheckoutTabIndex.VOUCHERS:
      return (
        <Grid item display="flex" alignItems="center">
          {' '}
          <LoadingButton
            variant="contained"
            loadingPosition="end"
            onClick={() => {
              setTabIndex(tabIndex + 1);
              handleAddVouchersToCart();
            }}
            disabled={disabled}
          >
            Next
          </LoadingButton>
        </Grid>
      );

    case NormalCheckoutTabIndex.INVOICE:
      return (
        <LoadingButton
          variant="contained"
          loading={orderLoading}
          loadingPosition="end"
          endIcon={<BorderColorIcon />}
          onClick={() => {
            handlePlaceOrder();
          }}
          disabled={disabled}
        >
          Place An Order
        </LoadingButton>
      );
    default:
      return <>Invalid Tab Index</>;
  }
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

interface CustomerDetailsBlockProps extends BoxProps {
  selectedCustomer: CustomerInterface;
}
export function CustomerDetailsBlock(props: CustomerDetailsBlockProps) {
  const { selectedCustomer, ...boxProps } = props;
  const theme = useTheme();
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box
          my={2}
          sx={{
            // backgroundColor: theme.block?.gray,
            borderRadius: 2,
          }}
          p={2}
          {...boxProps}
        >
          <Typography variant="h6" color={theme.palette.secondary.contrastText}>
            Customer Details
          </Typography>

          <Box my={2} mx={1}>
            <Grid container direction="column">
              <Typography mb={2}>
                {getSalutation(selectedCustomer.gender)}{' '}
                <strong>{selectedCustomer.firstName}</strong>{' '}
                {selectedCustomer.lastName || ''}
              </Typography>
              <Typography mb={1}>Phone: +{selectedCustomer.phone}</Typography>
              <Typography mb={1}>
                Email: {selectedCustomer.email || 'N/A'}
              </Typography>
              <Typography mb={1}>
                Points: {selectedCustomer.points || 0}
              </Typography>
              <Typography mb={1}>
                Ranking: {selectedCustomer?.ranking}
              </Typography>
              <Typography mb={1}>
                Total Orders: {selectedCustomer?.orders?.length || 0}
              </Typography>
            </Grid>
          </Box>
        </Box>
      </Grid>

      <Grid item xs display="flex" justifyContent="center" alignItems="center">
        <img
          src={genAvatarImage(selectedCustomer.gender)}
          alt="avatar"
          width={200}
        />
      </Grid>
    </Grid>
  );
}
