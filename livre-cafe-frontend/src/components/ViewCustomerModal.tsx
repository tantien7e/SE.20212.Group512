import { selectBooksLoading } from '@app/app/features/books/books-slice';
import { selectDrinksAddLoading } from '@app/app/features/drinks/drinks-slice';
import BasicOrdersHistoryTable from '@app/components/BasicOrdersHistoryTable';
import { BootstrapDialogTitle } from '@app/components/ViewOrderModal';
import { InventoryType } from '@app/constants';
import {
  CUSTOMER,
  CustomerInterface,
  RankType,
} from '@app/models/customer.interface';
import { OrderInterface } from '@app/models/order.interface';
import { Dialog, DialogContent, Divider, Grid, TableCell } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
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
  points: number;
  ranking: RankType;
  orders: OrderInterface[];
}

export default function ViewCustomerModal(props: AddModalProps) {
  const dispatch = useDispatch();
  const drinksLoading = useSelector(selectDrinksAddLoading);
  const booksLoading = useSelector(selectBooksLoading);
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
    phone: item?.phone || '',
    email: item?.email || '',
    points: item?.exchangeablePoints || 0,
    ranking: item?.ranking || RankType.SILVER,
    orders: item?.ordersHistory || [],
  });

  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;

  React.useEffect(() => {
    const loading = drinksLoading || booksLoading;
    if (addSuccess && !loading) {
      handleClose();
    }
  }, [addSuccess, drinksLoading, booksLoading]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth='md'
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
              View {type.toLowerCase()}
            </strong>
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography
            variant="body1"
            style={{ padding: ` ${theme.spacing(1)} 0` }}
            color={theme.palette.secondary.contrastText}
            fontWeight={600}
          >
            Customer's Info
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
                      </Grid>
                    </label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <Typography fontWeight={600}>
                      {' '}
                      {customerState?.firstName}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="last-name">Last Name</label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <Typography fontWeight={600}>
                      {' '}
                      {customerState?.lastName || ''}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="phone">
                      <Grid container>
                        <Typography>Phone</Typography>{' '}
                      </Grid>
                    </label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <Typography fontWeight={600}>
                      {' '}
                      {customerState?.phone}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="email">
                      <Grid container>
                        <Typography>Email</Typography>{' '}
                      </Grid>
                    </label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <Typography fontWeight={600}>
                      {' '}
                      {customerState?.email}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="points">
                      <Grid container>
                        <Typography>Points</Typography>{' '}
                      </Grid>
                    </label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <Typography fontWeight={600}>
                      {' '}
                      {customerState?.points}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
          <Divider />
          <Typography
            variant="body1"
            style={{ padding: ` ${theme.spacing(1)} 0` }}
            color={theme.palette.secondary.contrastText}
            fontWeight={600}
          >
            Order History
          </Typography>
          {customerState.orders && customerState.orders.length > 0 && (
            <BasicOrdersHistoryTable
              rows={customerState.orders || []}
              headCells={[
                <TableCell align="left">Order ID</TableCell>,
                <TableCell align="right">Items</TableCell>,
                <TableCell align="right">Booked At</TableCell>,
                <TableCell align="right">Status</TableCell>,
                <TableCell align="right">Total Cost</TableCell>,
              ]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
