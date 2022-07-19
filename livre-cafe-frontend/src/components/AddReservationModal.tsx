import { BootstrapDialogTitle } from '@app/components/ViewOrderModal';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AreaInterface, CustomerInterface } from '@app/models';
import PickerButton from '@app/components/PickerButton';
import moment from 'moment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { height } from '@mui/system';
import GroupedSearchBar from '@app/components/GroupedSearchBar';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCustomers,
  selectCustomers,
} from '@app/app/features/customers/customers-slice';
import { CustomerDetailsBlock } from '@app/components/NormalCheckoutModal';
interface AddReservationProps {
  open: boolean;
  handleClose: () => void;
  area: AreaInterface;
}

function AddReservationModal(props: AddReservationProps) {
  const { open, handleClose, area } = props;
  const [date, setDate] = useState<Date>(new Date());
  const customersSelector = useSelector(selectCustomers);
  const { customers, loading } = customersSelector;
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInterface>();
  const [filterText, setFilterText] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const dispatch = useDispatch();
  const handleSelect = (customer: CustomerInterface) => {
    setSelectedCustomer(customer);
    setFilterText(`${customer.firstName} ${customer.lastName}`);
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

  useEffect(() => {
    if (!customers) {
      dispatch(fetchCustomers());
    }
    handleSearch(filterText);
  }, [dispatch, customers]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth="lg"
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
              xs={6}
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
                <PickerButton
                  fontColor={theme.palette.secondary.contrastText}
                  endIcon={<CalendarMonthIcon />}
                >
                  {moment(date).format('ddd, D MMM YYYY')}
                </PickerButton>
              </Grid>
              <Grid item container direction={'column'} rowGap={1}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={theme.palette.secondary.contrastText}
                >
                  Duration
                </Typography>
                <PickerButton
                  fontColor={theme.palette.secondary.contrastText}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  2 hours
                </PickerButton>
              </Grid>
              <Grid item container direction={'column'} rowGap={1}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={theme.palette.secondary.contrastText}
                >
                  Time
                </Typography>
                <PickerButton
                  fontColor={theme.palette.secondary.contrastText}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  10:00
                </PickerButton>
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
                ></TextField>
              </Grid>
            </Grid>
            <Grid
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
              <Grid item>
                <Typography
                  variant="h6"
                  color={theme.palette.secondary.contrastText}
                >
                  Customer Details
                </Typography>
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

              {selectedCustomer && (
                <Grid item container xs={12}>
                  <CustomerDetailsBlock
                    selectedCustomer={selectedCustomer}
                    noImage
                    noTitle
                    m={-4}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
          <Button variant="contained">Add Reservation</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddReservationModal;
