import BasicTable from '@app/components/BasicTable';
import { CartAction, Store } from '@app/context/Store';
import { getCartTotal, numberWithCommasRound2 } from '@app/utils';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TableCell,
  Typography
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import React, { useContext, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

interface ModalPropsInterface {
  open: boolean;
  handleClose: () => void;
}

export default function PrintOrderModal(props: ModalPropsInterface) {
  const { open, handleClose } = props;
  const theme = useTheme();
  const [orderLoading, setOrderLoading] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(true);
  const dispatch = useDispatch();
  const {
    state: { cart },
    dispatch: ctxDispatch,
  } = useContext(Store);
  const invoiceRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });
  function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  const handlePlaceOrder = async () => {
    try {
      setOrderLoading(true);
      await delay(500);
      ctxDispatch({ type: CartAction.CART_CLEAR });
      toastInformSuccess('Order was placed successfully!');
      setOrderLoading(false);
      if (printInvoice) handlePrint();
      handleClose();
    } catch (err) {
      toastError("Something's wrong");
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {`Invoice's Information`}
        </DialogTitle>
        <Divider />
        <DialogContent ref={invoiceRef}>
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
                    {numberWithCommasRound2(getCartTotal(cart.cartItems))}$
                  </Typography>
                </Grid>
                <Grid item container justifyContent="space-between">
                  <Typography>VAT: </Typography>
                  <Typography>
                    {numberWithCommasRound2(getCartTotal(cart.cartItems) * 0.1)}
                    $
                  </Typography>
                </Grid>

                <Grid item container justifyContent="space-between">
                  <Typography>Total: </Typography>
                  <Typography>
                    {numberWithCommasRound2(getCartTotal(cart.cartItems) * 1.1)}
                    $
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
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container direction="column" padding={`${theme.spacing(2)}`}>
            <Grid item>
              <FormControlLabel
                label="Print Invoice"
                control={
                  <Checkbox
                    checked={printInvoice}
                    // indeterminate={checked[0] !== checked[1]}
                    onChange={(e) => setPrintInvoice(e.target.checked)}
                  />
                }
              />
            </Grid>

            <Grid container justifyContent="space-between">
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
                <LoadingButton
                  variant="contained"
                  loading={orderLoading}
                  loadingPosition="end"
                  endIcon={<BorderColorIcon />}
                  onClick={() => {
                    handlePlaceOrder();
                  }}
                >
                  Place An Order
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}
