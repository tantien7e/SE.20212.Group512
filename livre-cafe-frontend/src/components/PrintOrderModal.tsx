import {
  addOrder,
  selectOrdersAddLoading,
  selectOrdersError
} from '@app/app/features/orders/orders-slice';
import Invoice from '@app/components/Invoice';
import { CartAction, Store } from '@app/context/Store';
import {
  OrderPostData,
  OrderStatusType
} from '@app/models/order.interface';
import { genOrderPostItems, getTotalCost } from '@app/utils';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { LoadingButton } from '@mui/lab';
import { Checkbox, Divider, FormControlLabel, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

interface ModalPropsInterface {
  open: boolean;
  handleClose: () => void;
}

export default function PrintOrderModal(props: ModalPropsInterface) {
  const { open, handleClose } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const orderLoading = useSelector(selectOrdersAddLoading);
  const orderError = useSelector(selectOrdersError);
  const [printInvoice, setPrintInvoice] = useState(true);
  const [isPost, setIsPost] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const invoiceRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const handlePlaceOrder = () => {
    const postOrderData: OrderPostData = {
      itemsOrdered: genOrderPostItems(state.cart.cartItems),
      status: OrderStatusType.PROCESSING,
      bookedAt: new Date(),
      totalCost: getTotalCost(state) * 1.1,
    };
    dispatch(addOrder(postOrderData));
    setIsPost(true);
  };

  useEffect(() => {
    if (!orderLoading && isPost && !orderError) {
      ctxDispatch({ type: CartAction.CART_CLEAR });
      if (printInvoice) handlePrint();
      handleClose();
    }
  }, [orderLoading, isPost, orderError]);

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
          <Invoice />
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
