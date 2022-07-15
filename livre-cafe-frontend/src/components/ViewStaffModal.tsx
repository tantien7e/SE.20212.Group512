import { selectBooksLoading } from '@app/app/features/books/books-slice';
import { selectDrinksAddLoading } from '@app/app/features/drinks/drinks-slice';
import BasicOrdersHistoryTable from '@app/components/BasicOrdersHistoryTable';
import { OrderStatusBadge } from '@app/components/OrdersTable';
import { BootstrapDialogTitle } from '@app/components/ViewOrderModal';
import { OrderInterface } from '@app/models/order.interface';
import { StaffResponse } from '@app/models/user.interface';
import { numberWithCommasRound2 } from '@app/utils';
import {
  Dialog,
  DialogContent,
  Divider,
  Grid,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import moment from 'moment';
import { useEffect, useState } from 'react';
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

interface ViewModalProps {
  open: boolean;
  handleClose: () => void;
  item: StaffResponse;
}

export default function ViewStaffModal(props: ViewModalProps) {
  const dispatch = useDispatch();
  const drinksLoading = useSelector(selectDrinksAddLoading);
  const booksLoading = useSelector(selectBooksLoading);
  const [addSuccess, setAddSuccess] = useState(false);
  const { open, handleClose, item } = props;
  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;

  useEffect(() => {
    const loading = drinksLoading || booksLoading;
    if (addSuccess && !loading) {
      handleClose();
    }
  }, [addSuccess, drinksLoading, booksLoading]);
  const rowData = (row: OrderInterface, index: number) => {
    const { customer } = row;
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <TableRow
        key={row._id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
          align="left"
          width={100}
        >
          <Tooltip title={row._id || ''}>
            <Typography
              overflow="hidden"
              textOverflow="ellipsis"
              width={100}
              whiteSpace="nowrap"
            >{`${row._id} `}</Typography>
          </Tooltip>
        </TableCell>
        {customer ? (
          <TableCell align="left">
            <strong>{customer?.firstName}</strong> {customer?.lastName}
          </TableCell>
        ) : (
          <TableCell align="left">Guest</TableCell>
        )}
        <TableCell align="left">
          {row.itemsOrdered.reduce(
            (a, c, cIndex) =>
              a +
              (c.product.title || c.product.name) +
              (cIndex < row.itemsOrdered.length - 1 ? ', ' : '.'),
            '',
          )}
        </TableCell>

        <TableCell align="left">
          {moment(row.createdAt).format('DD.MM.YYYY')}
        </TableCell>
        <TableCell align="left">
          <OrderStatusBadge status={row.status} />
        </TableCell>
        <TableCell align="right">
          ${numberWithCommasRound2(row.totalCost)}
        </TableCell>
      </TableRow>
    );
  };

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
            <strong style={{ textTransform: 'capitalize' }}>View Staff</strong>
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              padding: `${theme.spacing(2)} 0`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '600px',
            }}
          >
            {item?.imageUrl && (
              <img
                src={item.imageUrl}
                alt={'item image'}
                style={{
                  height: '256px',
                  maxHeight: '50vh',
                  borderRadius: '8px',
                  margin: `${theme.spacing(2)} 0`,
                }}
              />
            )}
            <br />
            <Typography variant="body1">
              <strong>{item.firstName}</strong> {item.lastName || ''}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            style={{ padding: ` ${theme.spacing(1)} 0` }}
            color={theme.palette.secondary.contrastText}
            fontWeight={600}
          >
            Staff's Info
          </Typography>
          <Divider />
          <Box my={2}>
            <Grid container spacing={2}>
              {/* <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="first-name">
                    <Grid container>
                      <Typography>First Name</Typography>{' '}
                    </Grid>
                  </label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <Typography fontWeight={600}> {item?.firstName}</Typography>
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="last-name">Last Name</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <Typography fontWeight={600}>
                    {' '}
                    {item?.lastName || ''}
                  </Typography>
                </Grid>
              </Grid> */}
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
                    {isValidPhoneNumber('+' + item?.phone || '')
                      ? parsePhoneNumber(
                          '+' + item?.phone || '',
                        ).formatInternational()
                      : item?.phone}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="username">
                    <Grid container>
                      <Typography>Username</Typography>{' '}
                    </Grid>
                  </label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <Typography fontWeight={600}>{item.username}</Typography>
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="Role">
                    <Grid container>
                      <Typography>Role</Typography>{' '}
                    </Grid>
                  </label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <Typography fontWeight={600}>
                    {item.isManager ? 'Manager' : 'Staff'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Divider />
          <Typography
            variant="body1"
            style={{ padding: ` ${theme.spacing(1)} 0` }}
            color={theme.palette.secondary.contrastText}
            fontWeight={600}
          >
            Orders Handled
          </Typography>
          {item.ordersHandled && item.ordersHandled.length > 0 && (
            <BasicOrdersHistoryTable
              rows={item.ordersHandled || []}
              rowData={rowData}
              headCells={[
                <TableCell align="left">Order ID</TableCell>,
                <TableCell align="left">Customer</TableCell>,
                <TableCell align="left">Items</TableCell>,
                <TableCell align="left">Booked At</TableCell>,
                <TableCell align="left">Status</TableCell>,
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
