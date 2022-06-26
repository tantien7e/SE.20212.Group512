import BasicTable from '@app/components/BasicTable';
import { Store } from '@app/context/Store';
import { VoucherInterface } from '@app/models';
import {
  getCartTotal,
  getTotalCost,
  getVouchersTotal,
  numberWithCommasRound2,
} from '@app/utils';
import {
  Box,
  BoxProps,
  Divider,
  Grid,
  TableCell,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import React, { useContext } from 'react';

interface InvoiceProps extends BoxProps {
  vouchers?: VoucherInterface[];
}

function Invoice(props: InvoiceProps) {
  const { vouchers } = props;
  const theme = useTheme();
  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <Box>
      <Grid container direction={'column'}>
        <Grid item xs={12} container justifyContent="center">
          <Typography
            variant="h3"
            sx={{ fontFamily: 'Caveat, cursive', fontWeight: 600 }}
          >
            Livre Café
          </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Typography>I N V O I C E</Typography>
        </Grid>
        <Grid
          item
          container
          direction="column"
          my={2}
          sx={{
            '& .MuiTypography-root': {
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 300,
            },
          }}
        >
          <Grid item>
            <Typography>
              Address: 1 Dai Co Viet, Bach Khoa, Hai Ba Trung, Hanoi
            </Typography>
          </Grid>
          <Grid item marginBottom={3}>
            <Typography>Tel: 1900 599 840</Typography>
          </Grid>
          <Grid item>
            <Typography>
              Date: {moment().format('MMMM D, YYYY HH:mm:ss')}
            </Typography>
          </Grid>
          <Divider sx={{ margin: `${theme.spacing(2)} 0` }} />
          <Grid item sx={{ margin: `0` }}>
            <BasicTable
              headCells={[
                <TableCell align="left">Name</TableCell>,
                <TableCell align="right">Quantity</TableCell>,
                <TableCell align="right">Price&nbsp;($)</TableCell>,
                <TableCell align="right">Total&nbsp;($)</TableCell>,
                <TableCell align="right">
                  Additonal Requirements&nbsp;
                </TableCell>,
              ]}
              rows={cart.cartItems}
            />
          </Grid>
          <Divider sx={{ margin: `${theme.spacing(2)} 0` }} />
          <Grid item container justifyContent="space-between">
            <Typography>Subtotal: </Typography>
            <Typography>
              ${numberWithCommasRound2(getCartTotal(cart.cartItems))}
            </Typography>
          </Grid>

          {vouchers && vouchers.length > 0 && (
            <Grid item container justifyContent="space-between">
              <Typography>Vouchers: </Typography>
              <Typography>
                -${numberWithCommasRound2(getVouchersTotal(vouchers))}
              </Typography>
            </Grid>
          )}

          <Grid item container justifyContent="space-between">
            <Typography>VAT: </Typography>
            <Typography>
              ${numberWithCommasRound2(getTotalCost(state) * 0.1)}
            </Typography>
          </Grid>

          <Grid item container justifyContent="space-between">
            <Typography>Total: </Typography>
            <Typography>
              ${numberWithCommasRound2(getTotalCost(state) * 1.1)}
            </Typography>
          </Grid>
          <Divider sx={{ marginTop: `${theme.spacing(2)}` }} />
        </Grid>
        <Grid item container justifyContent="center">
          <Typography
            textAlign="center"
            sx={{ fontFamily: 'Caveat, cursive' }}
            variant="h5"
          >
            Thank you and see you again!
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Invoice;
